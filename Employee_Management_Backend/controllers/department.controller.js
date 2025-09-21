import Department from "../models/userModels/department.model.js";
import User from "../models/userModels/user.model.js";
import { isPositiveNumber } from "../utils/validators.js";
import { Op } from "sequelize";

// Create department
export const addDepartment = async (req, res) => {
  try {
    let { department_name, department_code, description, budget, manager_id } = req.body;
    department_name = department_name?.trim();
    department_code = department_code?.trim();
    description = description?.trim();

    if (!department_name || !department_code || !manager_id) {
      return res.status(400).json({ message: "Department name, code, and manager are required" });
    }

    const existingDept = await Department.findOne({ where: { department_name } });
    if (existingDept) return res.status(400).json({ message: "Department name already exists" });

    const existingCode = await Department.findOne({ where: { department_code } });
    if (existingCode) return res.status(400).json({ message: "Department code already exists" });

    const manager = await User.findOne({ where: { id: manager_id, user_type: "department_manager" } });
    if (!manager) return res.status(400).json({ message: "Selected manager is not valid" });

    if (budget && !isPositiveNumber(budget)) {
      return res.status(400).json({ message: "Budget must be a positive number" });
    }

    const department = await Department.create({
      department_name,
      department_code,
      description,
      budget,
      manager_id
    });

    return res.status(201).json({ message: "Department added successfully", department });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add department" });
  }
};

// Get all (with pagination, search)
export const getAllDepartments = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const search = req.query.search?.trim();

    const where = {};
    if (search) {
      where[Op.or] = [
        { department_name: { [Op.like]: `%${search}%` } },
        { department_code: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Department.findAndCountAll({
      where,
      include: [{ model: User, as: "manager", attributes: ["id", "full_name", "email"] }],
      limit,
      offset,
      order: [["created_at", "DESC"]]
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
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

// Get department by id
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id, {
      include: [{ model: User, as: "manager", attributes: ["id", "full_name", "email"] }]
    });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch department" });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    let { department_name, department_code, description, budget, manager_id, is_active } = req.body;
    department_name = department_name?.trim();
    department_code = department_code?.trim();
    description = description?.trim();

    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    if (department_name && department_name !== department.department_name) {
      const existingDept = await Department.findOne({ where: { department_name } });
      if (existingDept) return res.status(400).json({ message: "Department name already exists" });
    }

    if (department_code && department_code !== department.department_code) {
      const existingCode = await Department.findOne({ where: { department_code } });
      if (existingCode) return res.status(400).json({ message: "Department code already exists" });
    }

    if (manager_id) {
      const manager = await User.findOne({ where: { id: manager_id, user_type: "department_manager" } });
      if (!manager) return res.status(400).json({ message: "Selected manager is not valid" });
    }

    if (budget && !isPositiveNumber(budget)) {
      return res.status(400).json({ message: "Budget must be a positive number" });
    }

    department.department_name = department_name ?? department.department_name;
    department.department_code = department_code ?? department.department_code;
    department.description = description ?? department.description;
    department.budget = budget ?? department.budget;
    department.manager_id = manager_id ?? department.manager_id;
    department.is_active = is_active ?? department.is_active;

    await department.save();

    res.json({ message: "Department updated successfully", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update department" });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.destroy();
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete department" });
  }
};

// Get department managers list (for dropdown)
export const getDepartmentManagers = async (req, res) => {
  try {
    const managers = await User.findAll({
      where: { user_type: "department_manager" },
      attributes: ["id", "full_name", "email", "phone"]
    });
    res.json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch managers" });
  }
};
