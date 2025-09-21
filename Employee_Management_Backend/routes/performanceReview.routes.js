import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  createPerformanceReview,
  getAllPerformanceReviews,
  getPerformanceReviewById,
  getReviewsByEmployee,
  updatePerformanceReview,
  deletePerformanceReview,
  finalizeReview,
  getPerformanceAnalytics,
  getTopPerformers,
  getPerformanceTrends
} from "../controllers/performanceReview.controller.js";

const router = express.Router();

// ✅ CRUD Endpoints
router.post("/", authenticate, authorize("hr_manager", "department_manager"), createPerformanceReview);           // Create review
router.get("/", authenticate, authorize("hr_manager", "admin"), getAllPerformanceReviews);           // Get all reviews
router.get("/:id", authenticate, getPerformanceReviewById);        // Get review by ID
router.put("/:id", authenticate, authorize("hr_manager", "department_manager"), updatePerformanceReview);         // Update review
router.delete("/:id", authenticate, authorize("hr_manager", "admin"), deletePerformanceReview);      // Delete review

// ✅ Extra Endpoints
router.get("/employee/:employeeId", authenticate, getReviewsByEmployee); // Reviews for an employee
router.put("/:id/finalize", authenticate, finalizeReview);               // Finalize review

// ✅ Performance Analytics Endpoints
router.get("/analytics/dashboard", authenticate, authorize("hr_manager", "admin"), getPerformanceAnalytics); // Performance dashboard
router.get("/analytics/top-performers", authenticate, authorize("hr_manager", "admin"), getTopPerformers); // Top performers
router.get("/analytics/trends", authenticate, authorize("hr_manager", "admin"), getPerformanceTrends); // Performance trends

export default router;
