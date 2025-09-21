import express from "express";
import {
    addDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentManagers
} from "../controllers/department.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllDepartments);
router.post("/", authenticate, authorize("admin"), addDepartment);
router.get("/managers", authenticate, authorize("admin", "hr_manager"), getDepartmentManagers);
router.get("/:id", authenticate, authorize("admin", "hr_manager", "department_manager"), getDepartmentById);
router.put("/:id", authenticate, authorize("admin"), updateDepartment);
router.delete("/:id", authenticate, authorize("admin"), deleteDepartment);

export default router;
