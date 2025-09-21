import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  applyLeave,
  getAllLeaveApplications,
  getLeaveApplicationById,
  updateLeaveApplication,
  deleteLeaveApplication,
  approveLeave,
  rejectLeave,
  getEmployeeLeaveApplications,
  getPendingApprovals,
  getLeaveBalances
} from "../controllers/leaveApplication.controller.js";

const router = express.Router();

// ✅ CRUD Endpoints
router.post("/", authenticate, applyLeave);             // Apply for leave
router.get("/leaves", authenticate, getAllLeaveApplications); // Get all leave applications
router.get("/leaves/:id", authenticate, getLeaveApplicationById); // Get single leave application
router.put("/:id", authenticate, updateLeaveApplication);  // Update before approval
router.delete("/:id", authenticate, deleteLeaveApplication); // Cancel leave

// ✅ Approval Flow
router.put("/:id/approve", authenticate, authorize("department_manager", "hr_manager"), approveLeave); // Approve leave (manager/hr)
router.put("/:id/reject", authenticate, authorize("department_manager", "hr_manager"), rejectLeave);   // Reject leave

// ✅ Employee specific routes
router.get("/employee/:employeeId", authenticate, getEmployeeLeaveApplications); // Get employee's leave applications
router.get("/pending-approvals", authenticate, authorize("department_manager", "hr_manager"), getPendingApprovals); // Get pending approvals
router.get("/leave-balances/employee/:employeeId", authenticate, getLeaveBalances); // Get leave balances

export default router;
