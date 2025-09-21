import { Op } from "sequelize";
import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import Department from "../models/userModels/department.model.js";
import Attendance from "../models/attendance.model.js";
import { isPositiveNumber } from "../utils/validators.js";
import Designation from "../models/designation.model.js";
import Leave from "../models/leaveApplication.model.js";

// ==========================
// Helper Functions
// ==========================
const validateEmployeeStatus = (status) => ["active", "inactive", "terminated", "resigned"].includes(status);
const validateEmploymentType = (type) => ["permanent", "contract", "intern", "consultant"].includes(type);
const validateGender = (gender) => ["male", "female", "other"].includes(gender);
const validateMaritalStatus = (status) => ["single", "married", "divorced", "widowed"].includes(status);

const getPagination = (query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Number(query.limit) || 10);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};

// ==========================
// Get All Employees
// ==========================
export const getAllEmployees = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(req.query);
        const { search, department_id, status, employment_type } = req.query;

        const where = {};
        const userWhere = {};

        if (search) {
            userWhere[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        if (department_id) where.department_id = department_id;
        if (status) where.status = status;
        if (employment_type) where.employment_type = employment_type;

        const { rows, count } = await Employee.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ["id", "full_name", "email", "phone", "user_type", "is_active"],
                    where: Object.keys(userWhere).length ? userWhere : undefined
                },
                { model: Department, attributes: ["id", "department_name", "department_code"] },
                { model: Designation, attributes: ["id", "designation_title"] }
            ],
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
        res.status(500).json({ message: "Error fetching employees", error: err.message });
    }
};

// ==========================
// Get Employee Profile
// ==========================
export const getEmployeeProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: [
                { model: User, attributes: ["id", "full_name", "email", "phone", "user_type", "is_active"] },
                { model: Department, attributes: ["id", "department_name", "department_code"] }
            ]
        });

        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (req.user.role === "employee" && req.user.userId !== employee.user_id)
            return res.status(403).json({ message: "Access denied" });

        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
};

// ==========================
// Update Employee Profile
// ==========================
export const updateEmployeeProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: [{ model: User, attributes: ["id", "full_name", "email"] }]
        });
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (req.user.role === "employee" && req.user.userId !== employee.user_id)
            return res.status(403).json({ message: "Employees can only update their own profile" });

        const {
            address,
            emergency_contact_name,
            emergency_contact_phone,
            profile_photo_url,
            department_id,
            manager_id,
            employment_type,
            probation_period_months
        } = req.body;

        if (department_id && req.user.role !== "employee") {
            const department = await Department.findByPk(department_id);
            if (!department) return res.status(400).json({ message: "Invalid department" });
            employee.department_id = department_id;
        }

        if (manager_id && req.user.role !== "employee") {
            const manager = await Employee.findByPk(manager_id);
            if (!manager) return res.status(400).json({ message: "Invalid manager" });
            employee.manager_id = manager_id;
        }

        if (employment_type && !validateEmploymentType(employment_type)) {
            return res.status(400).json({ message: "Invalid employment type" });
        }

        if (probation_period_months && !isPositiveNumber(probation_period_months)) {
            return res.status(400).json({ message: "Probation period must be a positive number" });
        }

        // Update allowed fields
        const allowedFields = req.user.role === "employee"
            ? { address, emergency_contact_name, emergency_contact_phone, profile_photo_url }
            : { address, emergency_contact_name, emergency_contact_phone, profile_photo_url, employment_type, probation_period_months };

        Object.entries(allowedFields).forEach(([key, value]) => {
            if (value !== undefined) employee[key] = value;
        });

        await employee.save();

        const updatedEmployee = await Employee.findByPk(id, {
            include: [
                { model: User, attributes: ["id", "full_name", "email", "phone", "user_type"] },
                { model: Department, attributes: ["id", "department_name", "department_code"] }
            ]
        });

        res.json({ message: "Profile updated successfully", employee: updatedEmployee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// ==========================
// Change Employee Status
// ==========================
export const changeEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!validateEmployeeStatus(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const employee = await Employee.findByPk(id, { include: [User] });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        employee.status = status;
        await employee.save();

        res.json({ message: `Employee status changed to ${status}`, employee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Status update failed", error: err.message });
    }
};

// ==========================
// Create Employee
// ==========================
// export const createEmployee = async (req, res) => {
//     try {
//         const {
//             user_id, employee_id, date_of_birth, gender, marital_status,
//             address, emergency_contact_name, emergency_contact_phone,
//             join_date, confirmation_date, probation_period_months,
//             employment_type, department_id, manager_id
//         } = req.body;

//         // Required validation
//         if (!user_id || !employee_id || !join_date) {
//             return res.status(400).json({ message: "User ID, employee ID, and join date are required" });
//         }

//         const user = await User.findByPk(user_id);
//         if (!user || user.user_type !== "employee") {
//             return res.status(400).json({ message: "User must exist and be of type employee" });
//         }

//         if (await Employee.findOne({ where: { user_id } })) {
//             return res.status(400).json({ message: "Employee record already exists for this user" });
//         }

//         if (await Employee.findOne({ where: { employee_id } })) {
//             return res.status(400).json({ message: "Employee ID already exists" });
//         }

//         if (department_id && !(await Department.findByPk(department_id))) {
//             return res.status(400).json({ message: "Invalid department" });
//         }

//         if (manager_id && !(await Employee.findByPk(manager_id))) {
//             return res.status(400).json({ message: "Invalid manager" });
//         }

//         if (join_date && new Date(join_date) > new Date()) {
//             return res.status(400).json({ message: "Join date cannot be in the future" });
//         }

//         if (date_of_birth && new Date(date_of_birth) >= new Date()) {
//             return res.status(400).json({ message: "Date of birth cannot be today or in the future" });
//         }

//         if (probation_period_months && !isPositiveNumber(probation_period_months)) {
//             return res.status(400).json({ message: "Probation period must be positive" });
//         }

//         if (gender && !validateGender(gender)) return res.status(400).json({ message: "Invalid gender" });
//         if (marital_status && !validateMaritalStatus(marital_status)) return res.status(400).json({ message: "Invalid marital status" });
//         if (employment_type && !validateEmploymentType(employment_type)) return res.status(400).json({ message: "Invalid employment type" });

//         const employee = await Employee.create({
//             user_id, employee_id, date_of_birth, gender, marital_status,
//             address, emergency_contact_name, emergency_contact_phone,
//             join_date, confirmation_date, probation_period_months,
//             employment_type, department_id, manager_id
//         });

//         const newEmployee = await Employee.findByPk(employee.id, {
//             include: [
//                 { model: User, attributes: ["id", "full_name", "email", "phone", "user_type"] },
//                 { model: Department, attributes: ["id", "department_name", "department_code"] }
//             ]
//         });

//         res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to create employee", error: err.message });
//     }
// };

export const createEmployee = async (req, res) => {
    try {
        const {
            user_id, employee_id, date_of_birth, gender, marital_status,
            address, emergency_contact_name, emergency_contact_phone,
            join_date, confirmation_date, probation_period_months,
            employment_type, department_name, designation_name, manager_id
        } = req.body;

        // Required validation
        if (!user_id || !employee_id || !join_date) {
            return res.status(400).json({ message: "User ID, employee ID, and join date are required" });
        }

        const user = await User.findByPk(user_id);
        if (!user || user.user_type !== "employee") {
            return res.status(400).json({ message: "User must exist and be of type employee" });
        }

        if (await Employee.findOne({ where: { user_id } })) {
            return res.status(400).json({ message: "Employee record already exists for this user" });
        }

        if (await Employee.findOne({ where: { employee_id } })) {
            return res.status(400).json({ message: "Employee ID already exists" });
        }

        // 🔹 Find department by name if provided
        let department_id = null;
        if (department_name) {
            const department = await Department.findOne({ where: { department_name } });
            if (!department) {
                return res.status(400).json({ message: "Invalid department name" });
            }
            department_id = department.id;
        }

        // 🔹 Find designation by name if provided
        let designation_id = null;
        if (designation_name) {
            const designation = await Designation.findOne({ where: { designation_name } });
            if (!designation) {
                return res.status(400).json({ message: "Invalid designation name" });
            }
            designation_id = designation.id;
        }

        if (manager_id && !(await Employee.findByPk(manager_id))) {
            return res.status(400).json({ message: "Invalid manager" });
        }

        if (join_date && new Date(join_date) > new Date()) {
            return res.status(400).json({ message: "Join date cannot be in the future" });
        }

        if (date_of_birth && new Date(date_of_birth) >= new Date()) {
            return res.status(400).json({ message: "Date of birth cannot be today or in the future" });
        }

        if (probation_period_months && !isPositiveNumber(probation_period_months)) {
            return res.status(400).json({ message: "Probation period must be positive" });
        }

        if (gender && !validateGender(gender)) return res.status(400).json({ message: "Invalid gender" });
        if (marital_status && !validateMaritalStatus(marital_status)) return res.status(400).json({ message: "Invalid marital status" });
        if (employment_type && !validateEmploymentType(employment_type)) return res.status(400).json({ message: "Invalid employment type" });

        // 🔹 Create employee with department & designation IDs
        const employee = await Employee.create({
            user_id,
            employee_id,
            date_of_birth,
            gender,
            marital_status,
            address,
            emergency_contact_name,
            emergency_contact_phone,
            join_date,
            confirmation_date,
            probation_period_months,
            employment_type,
            department_id,
            designation_id,
            manager_id
        });

        const newEmployee = await Employee.findByPk(employee.id, {
            include: [
                { model: User, attributes: ["id", "full_name", "email", "phone", "user_type"] },
                { model: Department, attributes: ["id", "department_name", "department_code"] },
                { model: Designation, attributes: ["id", "designation_name"] }
            ]
        });

        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create employee", error: err.message });
    }
};


// ==========================
// Delete Employee
// ==========================
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, { include: [User] });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const attendanceCount = await Attendance.count({ where: { employee_id: id } });
        if (attendanceCount > 0) {
            return res.status(400).json({ message: "Cannot delete employee with attendance records" });
        }

        await employee.destroy();
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete employee", error: err.message });
    }
};

// ==========================
// Get Employees By Department
// ==========================
export const getEmployeesByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { page, limit, offset } = getPagination(req.query);
        const { status } = req.query;

        const where = { department_id: departmentId };
        if (status) where.status = status;

        const { rows, count } = await Employee.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ["id", "full_name", "email", "phone", "user_type"] },
                { model: Department, attributes: ["id", "department_name", "department_code"] }
            ],
            limit,
            offset,
            order: [["created_at", "DESC"]]
        });

        res.json({
            data: rows,
            meta: { total: count, page, lastPage: Math.ceil(count / limit) }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch employees by department", error: err.message });
    }
};

// ==========================
// Employee Statistics
// ==========================
export const getEmployeeStatistics = async (req, res) => {
    try {
        const totalEmployees = await Employee.count();
        const activeEmployees = await Employee.count({ where: { status: "active" } });
        const inactiveEmployees = await Employee.count({ where: { status: "inactive" } });
        const terminatedEmployees = await Employee.count({ where: { status: "terminated" } });
        const resignedEmployees = await Employee.count({ where: { status: "resigned" } });

        const employmentTypeStats = await Employee.findAll({
            attributes: ['employment_type', [Employee.sequelize.fn('COUNT', Employee.sequelize.col('employment_type')), 'count']],
            group: ['employment_type'],
            raw: true
        });

        const departmentStats = await Employee.findAll({
            attributes: ['department_id', [Employee.sequelize.fn('COUNT', Employee.sequelize.col('department_id')), 'count']],
            include: [{ model: Department, attributes: ['department_name'], required: false }],
            group: ['department_id', 'Department.department_name'],
            raw: true
        });

        res.json({
            overview: { total: totalEmployees, active: activeEmployees, inactive: inactiveEmployees, terminated: terminatedEmployees, resigned: resignedEmployees },
            employmentTypes: employmentTypeStats,
            departments: departmentStats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch employee statistics", error: err.message });
    }
};

// ==========================
// Reporting Structure
// ==========================
export const getReportingStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: [
                { model: User, attributes: ["id", "full_name", "email", "user_type"] },
                { model: Department, attributes: ["id", "department_name", "department_code"] }
            ]
        });

        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (req.user.role === "employee" && req.user.userId !== employee.user_id)
            return res.status(403).json({ message: "Access denied" });

        let manager = null;
        if (employee.manager_id) {
            manager = await Employee.findByPk(employee.manager_id, {
                include: [
                    { model: User, attributes: ["id", "full_name", "email"] },
                    { model: Department, attributes: ["department_name"] }
                ]
            });
        }

        const subordinates = await Employee.findAll({
            where: { manager_id: id },
            include: [
                { model: User, attributes: ["id", "full_name", "email"] },
                { model: Department, attributes: ["department_name"] }
            ],
            order: [["created_at", "DESC"]]
        });

        const colleagues = employee.department_id ? await Employee.findAll({
            where: { department_id: employee.department_id, id: { [Op.ne]: id } },
            include: [
                { model: User, attributes: ["id", "full_name", "email"] },
                { model: Department, attributes: ["department_name"] }
            ],
            order: [["created_at", "DESC"]]
        }) : [];

        res.json({
            employee: {
                id: employee.id,
                employee_id: employee.employee_id,
                full_name: employee.User?.full_name,
                email: employee.User?.email,
                department: employee.Department,
                employment_type: employee.employment_type,
                status: employee.status
            },
            reporting_structure: {
                manager,
                subordinates,
                colleagues,
                hierarchy_level: subordinates.length > 0 ? "manager" : "employee"
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch reporting structure", error: err.message });
    }
};


export const getDashboardOverview = async (req, res) => {
    try {
        const totalEmployees = await Employee.count();
        const activeEmployees = await Employee.count({ where: { status: "active" } });
        const pendingLeaves = await Leave.count({ where: { status: "pending" } });
        // const todaysAttendance = await Attendance.count({
        //     where: { date: new Date().toISOString().split("T")[0] }
        // });

        res.json({
            totalEmployees,
            activeEmployees,
            pendingLeaves,

        });

    } catch (err) {
        console.error("Error fetching dashboard overview:", err);
        res.status(500).json({ message: "Error fetching overview", error: err.message });
    }
};
