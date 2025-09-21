import express from "express";
import {
  createLeaveType,
  getAllLeaveTypes,
  getLeaveTypeById,
  updateLeaveType,
  deleteLeaveType,
} from "../controllers/leaveType.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ CRUD Endpoints
router.get("/", authenticate, getAllLeaveTypes);                                      // Read all
router.get("/:id", authenticate, getLeaveTypeById);                                    // Read by ID
router.post("/", authenticate, authorize("hr_manager", "admin"), createLeaveType);   // Create
router.put("/:id", authenticate, authorize("hr_manager", "admin"), updateLeaveType); // Update
router.delete("/:id", authenticate, authorize("hr_manager", "admin"), deleteLeaveType); // Delete

export default router;
