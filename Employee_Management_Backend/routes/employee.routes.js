import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    getAllEmployees,
    getEmployeeProfile,
    updateEmployeeProfile,
    changeEmployeeStatus,
    createEmployee,
    getReportingStructure,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeeStatistics,
    getDashboardOverview
} from "../controllers/employee.controller.js";

const router = express.Router();

// ✅ Get all employees with pagination, search, and filtering (Admin/HR)
router.get("/", authenticate, authorize("admin", "hr_manager"), getAllEmployees);
router.get("/dashboard", authenticate, authorize("admin", "hr_manager"), getDashboardOverview);
// ✅ Create new employee (HR/Admin only)
router.post("/", authenticate, authorize("admin", "hr_manager"), createEmployee);

// ✅ Get employee statistics (Admin only)
router.get("/statistics", authenticate, authorize("admin", "hr_manager"), getEmployeeStatistics);

// ✅ Get employees by department (HR/Admin)
router.get("/department/:departmentId", authenticate, authorize("admin", "hr_manager"), getEmployeesByDepartment);

// ✅ Get reporting structure (Self / HR / Admin / Department Manager)
router.get("/:id/reporting-structure", authenticate, authorize("admin", "hr_manager"), getReportingStructure);

// ✅ Get single employee (Self / HR / Admin)
router.get("/:id", authenticate, authorize("admin", "hr_manager"), getEmployeeProfile);

// ✅ Update employee (Self or HR/Admin)
router.put("/:id", authenticate, authorize("admin", "hr_manager"), updateEmployeeProfile);

// ✅ Change employee status (HR/Admin only)
router.patch("/:id/status", authenticate, authorize("admin", "hr_manager"), changeEmployeeStatus);

// ✅ Delete employee (Admin only)
router.delete("/:id", authenticate, authorize("admin"), deleteEmployee);

export default router;
