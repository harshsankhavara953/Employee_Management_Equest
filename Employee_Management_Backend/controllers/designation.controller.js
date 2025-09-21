import Designation from "../models/designation.model.js";
import Department from "../models/userModels/department.model.js";
import { Op } from "sequelize";
import { isPositiveNumber } from "../utils/validators.js";

// ✅ Create Designation
export const createDesignation = async (req, res) => {
  try {
    let {
      designation_title,
      department_id,
      level,
      min_salary,
      max_salary,
      job_description,
      required_experience
    } = req.body;

    // Trim string inputs
    designation_title = designation_title?.trim();
    job_description = job_description?.trim();

    // Validate required fields
    if (!designation_title || !department_id || !level) {
      return res.status(400).json({
        message: "Designation title, department ID, and level are required"
      });
    }

    // Validate designation title length
    if (designation_title.length < 2 || designation_title.length > 100) {
      return res.status(400).json({
        message: "Designation title must be between 2 and 100 characters"
      });
    }

    // Validate level
    const validLevels = ["junior", "mid", "senior", "lead", "manager", "director"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        message: "Invalid level. Must be one of: junior, mid, senior, lead, manager, director"
      });
    }

    // Validate department exists
    const department = await Department.findByPk(department_id);
    if (!department) {
      return res.status(400).json({ message: "Department not found" });
    }

    // Validate salary range
    if (min_salary && !isPositiveNumber(min_salary)) {
      return res.status(400).json({ message: "Minimum salary must be a positive number" });
    }
    if (max_salary && !isPositiveNumber(max_salary)) {
      return res.status(400).json({ message: "Maximum salary must be a positive number" });
    }
    if (min_salary && max_salary && parseFloat(min_salary) >= parseFloat(max_salary)) {
      return res.status(400).json({ message: "Maximum salary must be greater than minimum salary" });
    }

    // Validate required experience
    if (required_experience && (!Number.isInteger(Number(required_experience)) || Number(required_experience) < 0)) {
      return res.status(400).json({ message: "Required experience must be a non-negative integer" });
    }

    // Check for duplicate designation in the same department
    const existingDesignation = await Designation.findOne({
      where: {
        designation_title,
        department_id
      }
    });
    if (existingDesignation) {
      return res.status(400).json({
        message: "Designation with this title already exists in the department"
      });
    }

    const designation = await Designation.create({
      designation_title,
      department_id,
      level,
      min_salary,
      max_salary,
      job_description,
      required_experience: required_experience || 0
    });

    // Fetch created designation with department info
    const newDesignation = await Designation.findByPk(designation.id, {
      include: [{ model: Department, attributes: ["id", "department_name", "department_code"] }]
    });

    res.status(201).json({
      message: "Designation created successfully",
      designation: newDesignation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create designation", error: err.message });
  }
};

// ✅ Get All Designations
export const getAllDesignations = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const search = req.query.search?.trim();
    const department_id = req.query.department_id;
    const level = req.query.level;
    const is_active = req.query.is_active;

    const where = {};

    // Search functionality
    if (search) {
      where[Op.or] = [
        { designation_title: { [Op.like]: `%${search}%` } },
        { job_description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by department
    if (department_id) {
      where.department_id = department_id;
    }

    // Filter by level
    if (level) {
      where.level = level;
    }

    // Filter by active status
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    const { rows, count } = await Designation.findAndCountAll({
      where,
      include: [{ model: Department, attributes: ["id", "department_name", "department_code"] }],
      limit,
      offset,
      order: [["created_at", "DESC"]] // ✅ use snake_case column
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page,
        lastPage: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch designations", error: err.message });
  }
};

// ✅ Get Designation by ID
export const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findByPk(id, {
      include: [{ model: Department, attributes: ["id", "department_name", "department_code"] }]
    });

    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.json(designation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch designation", error: err.message });
  }
};

// ✅ Update Designation
export const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      designation_title,
      department_id,
      level,
      min_salary,
      max_salary,
      job_description,
      required_experience,
      is_active
    } = req.body;

    // Trim string inputs
    designation_title = designation_title?.trim();
    job_description = job_description?.trim();

    const designation = await Designation.findByPk(id);
    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    // Validate designation title if provided
    if (designation_title && (designation_title.length < 2 || designation_title.length > 100)) {
      return res.status(400).json({
        message: "Designation title must be between 2 and 100 characters"
      });
    }

    // Validate level if provided
    if (level) {
      const validLevels = ["junior", "mid", "senior", "lead", "manager", "director"];
      if (!validLevels.includes(level)) {
        return res.status(400).json({
          message: "Invalid level. Must be one of: junior, mid, senior, lead, manager, director"
        });
      }
    }

    // Validate department if provided
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }
    }

    // Validate salary range if provided
    if (min_salary && !isPositiveNumber(min_salary)) {
      return res.status(400).json({ message: "Minimum salary must be a positive number" });
    }
    if (max_salary && !isPositiveNumber(max_salary)) {
      return res.status(400).json({ message: "Maximum salary must be a positive number" });
    }

    const finalMinSalary = min_salary ?? designation.min_salary;
    const finalMaxSalary = max_salary ?? designation.max_salary;

    if (finalMinSalary && finalMaxSalary && parseFloat(finalMinSalary) >= parseFloat(finalMaxSalary)) {
      return res.status(400).json({ message: "Maximum salary must be greater than minimum salary" });
    }

    // Validate required experience if provided
    if (required_experience !== undefined) {
      if (!Number.isInteger(Number(required_experience)) || Number(required_experience) < 0) {
        return res.status(400).json({ message: "Required experience must be a non-negative integer" });
      }
    }

    // Check for duplicate designation in the same department (excluding current designation)
    if (designation_title && department_id) {
      const existingDesignation = await Designation.findOne({
        where: {
          designation_title,
          department_id,
          id: { [Op.ne]: id }
        }
      });
      if (existingDesignation) {
        return res.status(400).json({
          message: "Designation with this title already exists in the department"
        });
      }
    }

    // Update fields
    if (designation_title !== undefined) designation.designation_title = designation_title;
    if (department_id !== undefined) designation.department_id = department_id;
    if (level !== undefined) designation.level = level;
    if (min_salary !== undefined) designation.min_salary = min_salary;
    if (max_salary !== undefined) designation.max_salary = max_salary;
    if (job_description !== undefined) designation.job_description = job_description;
    if (required_experience !== undefined) designation.required_experience = required_experience;
    if (is_active !== undefined) designation.is_active = is_active;

    await designation.save();

    // Fetch updated designation with department info
    const updatedDesignation = await Designation.findByPk(id, {
      include: [{ model: Department, attributes: ["id", "department_name", "department_code"] }]
    });

    res.json({
      message: "Designation updated successfully",
      designation: updatedDesignation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update designation", error: err.message });
  }
};

// ✅ Delete Designation
export const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findByPk(id, {
      include: [{ model: Department, attributes: ["department_name"] }]
    });

    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    // Check if designation is being used by employees
    const Employee = (await import("../models/userModels/employee.model.js")).default;
    const employeesUsingDesignation = await Employee.count({
      where: { designation_id: id }
    });

    if (employeesUsingDesignation > 0) {
      return res.status(400).json({
        message: `Cannot delete designation. It is currently assigned to ${employeesUsingDesignation} employee(s). Consider deactivating instead.`
      });
    }

    await designation.destroy();

    res.json({
      message: "Designation deleted successfully",
      deleted_designation: {
        id: designation.id,
        designation_title: designation.designation_title,
        department: designation.Department?.department_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete designation", error: err.message });
  }
};
