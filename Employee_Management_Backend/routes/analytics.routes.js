import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  getDashboard,
  getAttendanceTrends,
  getHeadcountAnalysis,
  getPerformanceSummary,
  getAttritionAnalysis,
  getSalaryDistribution,
  getLeaveUtilization,
  getPayrollSummary,
  getComplianceReports,
  getPredictiveAnalytics,
  getTrainingNeeds,
  getSuccessionPlanning
} from "../controllers/analytics.controller.js";

const router = express.Router();

// ✅ Core Analytics Routes (HR Manager/Admin only)
router.get("/dashboard", authenticate, authorize("hr_manager", "admin"), getDashboard);
router.get("/attendance-trends", authenticate, authorize("hr_manager", "admin"), getAttendanceTrends);
router.get("/headcount-analysis", authenticate, authorize("hr_manager", "admin"), getHeadcountAnalysis);
router.get("/performance-summary", authenticate, authorize("hr_manager", "admin"), getPerformanceSummary);

// ✅ Workforce Analytics Routes
router.get("/attrition-analysis", authenticate, authorize("hr_manager", "admin"), getAttritionAnalysis);
router.get("/salary-distribution", authenticate, authorize("hr_manager", "admin"), getSalaryDistribution);

// ✅ Operational Reports Routes
router.get("/leave-utilization", authenticate, authorize("hr_manager", "admin"), getLeaveUtilization);
router.get("/payroll-summary", authenticate, authorize("hr_manager", "admin"), getPayrollSummary);
router.get("/compliance-reports", authenticate, authorize("hr_manager", "admin"), getComplianceReports);

// ✅ Predictive Analytics Routes
router.get("/predictive-analytics", authenticate, authorize("hr_manager", "admin"), getPredictiveAnalytics);
router.get("/training-needs", authenticate, authorize("hr_manager", "admin"), getTrainingNeeds);
router.get("/succession-planning", authenticate, authorize("hr_manager", "admin"), getSuccessionPlanning);

export default router;