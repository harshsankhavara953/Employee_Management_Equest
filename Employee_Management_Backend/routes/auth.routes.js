import express from "express";
import { register, login, logout, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();

// Store file in memory so we can stream it to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 👇 Registration route with image upload
router.post("/register", upload.single("profile_photo_url"), register);

// Login route (no image)
router.post("/login", login);

// Logout route
router.post("/logout", authenticate, logout);

// Profile routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

export default router;
