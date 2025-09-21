import express from "express";
import {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} from "../controllers/designation.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ CRUD Endpoints with Authentication & Authorization
router.post("/", authenticate, authorize("admin", "hr_manager"), createDesignation);      // Create designation
router.get("/", getAllDesignations);      // Get all designations
router.get("/:id", authenticate, authorize("admin", "hr_manager"), getDesignationById);   // Get designation by ID
router.put("/:id", authenticate, authorize("admin", "hr_manager"), updateDesignation);    // Update designation
router.delete("/:id", authenticate, authorize("admin"), deleteDesignation); // Delete designation (Admin only)

export default router;
