import express from "express";
import { checkIn,
     checkOut, 
     getEmployeeAttendance,
      getDepartmentSummary,
      updateAttendance
    } from "../controllers/attendance.controller.js";

const router = express.Router();

import { authenticate, authorize } from "../middleware/auth.middleware.js";


// ✅ Only HR Managers can manage attendance
router.post("/check-in", authenticate, authorize("hr_manager"), checkIn);
router.post("/check-out", authenticate, authorize("hr_manager"), checkOut);
router.get("/employee/:id", authenticate, authorize("hr_manager"), getEmployeeAttendance);
router.get("/summary/department/:deptId", authenticate, authorize("hr_manager"), getDepartmentSummary);

// ✅ Update attendance (HR Manager only)
router.put("/:id", authenticate, authorize("hr_manager"), updateAttendance);

export default router;