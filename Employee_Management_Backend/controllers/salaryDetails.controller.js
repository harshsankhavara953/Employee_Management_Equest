import SalaryDetails from "../models/salaryDetails.model.js";
import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import { Op } from "sequelize";

// ✅ Create Salary Detail (HR Manager only)
export const createSalaryDetail = async (req, res) => {
  try {
    // Destructure and validate incoming data
    const {
      employee_id,
      basic_salary,
      hra = 0.0,
      da = 0.0,
      medical_allowance = 0.0,
      conveyance_allowance = 0.0,
      special_allowance = 0.0,
      gross_salary,
      pf_contribution = 0.0,
      professional_tax = 0.0,
      income_tax = 0.0,
      other_deductions = 0.0,
      net_salary,
      effective_from,
      effective_to = null,
      is_current = true,
    } = req.body;

    // Validate required fields
    if (!employee_id || !basic_salary || !gross_salary || !net_salary || !effective_from) {
      return res.status(400).json({ error: "Missing required fields: employee_id, basic_salary, gross_salary, net_salary, effective_from" });
    }

    // Validate numeric fields
    const numericFields = {
      basic_salary,
      hra,
      da,
      medical_allowance,
      conveyance_allowance,
      special_allowance,
      gross_salary,
      pf_contribution,
      professional_tax,
      income_tax,
      other_deductions,
      net_salary,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (typeof value !== 'number' || isNaN(value) || value < 0) {
        return res.status(400).json({ error: `${key} must be a valid non-negative number` });
      }
    }

    // Validate date fields
    if (!/^\d{4}-\d{2}-\d{2}$/.test(effective_from)) {
      return res.status(400).json({ error: "effective_from must be a valid date in YYYY-MM-DD format" });
    }
    if (effective_to && !/^\d{4}-\d{2}-\d{2}$/.test(effective_to)) {
      return res.status(400).json({ error: "effective_to must be a valid date in YYYY-MM-DD format" });
    }

    // Validate employee exists
    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Mark all previous salary records for this employee as not current
    await SalaryDetails.update(
      { is_current: false, effective_to: new Date() },
      { where: { employee_id, is_current: true } }
    );

    // Create new salary record
    const salaryDetail = await SalaryDetails.create({
      employee_id,
      basic_salary,
      hra,
      da,
      medical_allowance,
      conveyance_allowance,
      special_allowance,
      gross_salary,
      pf_contribution,
      professional_tax,
      income_tax,
      other_deductions,
      net_salary,
      effective_from,
      effective_to,
      is_current,
    });

    res.status(201).json({ message: "Salary detail created", data: salaryDetail });
  } catch (err) {
    res.status(500).json({ error: `Failed to create salary detail: ${err.message}` });
  }
};

// ✅ Get All Salary Details (HR Manager only)
export const getAllSalaryDetails = async (req, res) => {
  try {
    const salaryDetails = await SalaryDetails.findAll({
      include: [
        {
          model: Employee,
          attributes: ["id", "employee_id", "join_date"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
              required: true,
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(salaryDetails);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch salary details: ${err.message}` });
  }
};

// ✅ Get Salary Detail by ID
export const getSalaryDetailById = async (req, res) => {
  try {
    // Validate ID parameter
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid salary detail ID" });
    }

    const salaryDetail = await SalaryDetails.findByPk(id, {
      include: [
        {
          model: Employee,
          attributes: ["id", "employee_id", "join_date"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
              required: true,
            },
          ],
        },
      ],
    });

    if (!salaryDetail) {
      return res.status(404).json({ message: "Salary detail not found" });
    }

    res.json(salaryDetail);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch salary detail: ${err.message}` });
  }
};

// ✅ Update Salary Detail (HR Manager only)
export const updateSalaryDetail = async (req, res) => {
  try {
    // Destructure valid fields from req.body
    const {
      employee_id,
      basic_salary,
      hra = 0.0,
      da = 0.0,
      medical_allowance = 0.0,
      conveyance_allowance = 0.0,
      special_allowance = 0.0,
      gross_salary,
      pf_contribution = 0.0,
      professional_tax = 0.0,
      income_tax = 0.0,
      other_deductions = 0.0,
      net_salary,
      effective_from,
      effective_to = null,
      is_current,
    } = req.body;

    // Find the salary detail by ID
    const salaryDetail = await SalaryDetails.findByPk(req.params.id);
    if (!salaryDetail) {
      return res.status(404).json({ message: "Salary detail not found" });
    }

    // Validate employee_id if provided
    if (employee_id && employee_id !== salaryDetail.employee_id) {
      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
    }

    // Validate required fields if they are provided
    if (basic_salary !== undefined && (!Number.isFinite(basic_salary) || basic_salary < 0)) {
      return res.status(400).json({ error: "basic_salary must be a valid non-negative number" });
    }
    if (gross_salary !== undefined && (!Number.isFinite(gross_salary) || gross_salary < 0)) {
      return res.status(400).json({ error: "gross_salary must be a valid non-negative number" });
    }
    if (net_salary !== undefined && (!Number.isFinite(net_salary) || net_salary < 0)) {
      return res.status(400).json({ error: "net_salary must be a valid non-negative number" });
    }

    // Validate numeric fields
    const numericFields = {
      hra,
      da,
      medical_allowance,
      conveyance_allowance,
      special_allowance,
      pf_contribution,
      professional_tax,
      income_tax,
      other_deductions,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        return res.status(400).json({ error: `${key} must be a valid non-negative number` });
      }
    }

    // Validate date fields
    if (effective_from && !/^\d{4}-\d{2}-\d{2}$/.test(effective_from)) {
      return res.status(400).json({ error: "effective_from must be a valid date in YYYY-MM-DD format" });
    }
    if (effective_to && !/^\d{4}-\d{2}-\d{2}$/.test(effective_to)) {
      return res.status(400).json({ error: "effective_to must be a valid date in YYYY-MM-DD format" });
    }

    // If is_current is being set to true, mark other records for the same employee as not current
    if (is_current === true) {
      await SalaryDetails.update(
        { is_current: false, effective_to: effective_to || new Date() },
        { where: { employee_id: employee_id || salaryDetail.employee_id, is_current: true, id: { [Op.ne]: req.params.id } } }
      );
    }

    // Prepare update data
    const updateData = {};
    if (employee_id !== undefined) updateData.employee_id = employee_id;
    if (basic_salary !== undefined) updateData.basic_salary = basic_salary;
    if (hra !== undefined) updateData.hra = hra;
    if (da !== undefined) updateData.da = da;
    if (medical_allowance !== undefined) updateData.medical_allowance = medical_allowance;
    if (conveyance_allowance !== undefined) updateData.conveyance_allowance = conveyance_allowance;
    if (special_allowance !== undefined) updateData.special_allowance = special_allowance;
    if (gross_salary !== undefined) updateData.gross_salary = gross_salary;
    if (pf_contribution !== undefined) updateData.pf_contribution = pf_contribution;
    if (professional_tax !== undefined) updateData.professional_tax = professional_tax;
    if (income_tax !== undefined) updateData.income_tax = income_tax;
    if (other_deductions !== undefined) updateData.other_deductions = other_deductions;
    if (net_salary !== undefined) updateData.net_salary = net_salary;
    if (effective_from !== undefined) updateData.effective_from = effective_from;
    if (effective_to !== undefined) updateData.effective_to = effective_to;
    if (is_current !== undefined) updateData.is_current = is_current;

    // Update the salary detail
    await salaryDetail.update(updateData);

    res.json({ message: "Salary detail updated", data: salaryDetail });
  } catch (err) {
    res.status(500).json({ error: `Failed to update salary detail: ${err.message}` });
  }
};

// ✅ Delete Salary Detail (HR Manager only)
export const deleteSalaryDetail = async (req, res) => {
  try {
    // Validate ID parameter
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid salary detail ID" });
    }

    const salaryDetail = await SalaryDetails.findByPk(id);
    if (!salaryDetail) {
      return res.status(404).json({ message: "Salary detail not found" });
    }

    await salaryDetail.destroy();

    res.json({ message: "Salary detail deleted" });
  } catch (err) {
    res.status(500).json({ error: `Failed to delete salary detail: ${err.message}` });
  }
};

// ✅ Get Current Salary of Employee
export const getSalaryByEmployee = async (req, res) => {
  try {
    // Validate employeeId parameter
    const employeeId = parseInt(req.params.employeeId, 10);
    if (isNaN(employeeId) || employeeId <= 0) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const salaryDetail = await SalaryDetails.findOne({
      where: { employee_id: employeeId, is_current: true },
      include: [
        {
          model: Employee,
          attributes: ["id", "employee_id", "join_date"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
              required: true,
            },
          ],
        },
      ],
      order: [["effective_from", "DESC"]],
    });

    if (!salaryDetail) {
      return res.status(404).json({ message: "No current salary found for this employee" });
    }

    res.json(salaryDetail);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch salary detail: ${err.message}` });
  }
};