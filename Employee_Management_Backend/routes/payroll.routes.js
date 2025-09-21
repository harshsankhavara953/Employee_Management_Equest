import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  generatePayroll,
  getPayrollByEmployee,
  getPayslip,
  emailPayslip,
  getPayrollSummary,
} from "../controllers/payroll.controller.js";

const router = express.Router();

// ✅ Core Payroll APIs
router.post("/generate", authenticate, authorize("hr_manager"), generatePayroll);
router.get("/employee/:employeeId", authenticate,authorize("hr_manager"), getPayrollByEmployee);
router.get("/payslip/:payrollId", authenticate,authorize("hr_manager"), getPayslip);
router.post("/payslip/:payrollId/email", authenticate, authorize("hr_manager"), emailPayslip);
router.get("/summary", authenticate, authorize("hr_manager"), getPayrollSummary);

export default router;
