import express from "express";
import {
  createSalaryDetail,
  getAllSalaryDetails,
  getSalaryDetailById,
  updateSalaryDetail,
  deleteSalaryDetail,
  getSalaryByEmployee,
} from "../controllers/salaryDetails.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ HR Manager manages salaries
router.post("/", authenticate, authorize("hr_manager"), createSalaryDetail);
router.get("/", authenticate, authorize("hr_manager"), getAllSalaryDetails);
router.get("/:id", authenticate, authorize("hr_manager"), getSalaryDetailById);
router.put("/:id", authenticate, authorize("hr_manager"), updateSalaryDetail);
router.delete("/:id", authenticate, authorize("hr_manager"), deleteSalaryDetail);

// ✅ Employee can view only their current salary
router.get("/employee/:employeeId", authenticate, getSalaryByEmployee);

export default router;
