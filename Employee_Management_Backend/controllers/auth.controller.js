import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/userModels/user.model.js";
import Employee from "../models/userModels/employee.model.js";
import Department from "../models/userModels/department.model.js";
import cloudinary from "../config/cloudinary.js"; // ✅ use your existing config
import streamifier from "streamifier"; // helps convert buffer for upload_stream
import tokenBlacklist from "../utils/tokenBlacklist.js";
import Designation from "../models/designation.model.js";

const disposableDomains = ["10minutemail.com", "tempmail.com", "mailinator.com"];
const weakPasswords = ["password123", "admin", "12345678", "qwerty", "letmein"];

export const register = async (req, res) => {
  try {
    const { user_type, email, password, full_name, phone, department_name, designation_title, ...employeeData } = req.body;

    // Role validation
    const roles = ["admin", "hr_manager", "department_manager", "employee"];
    if (!roles.includes(user_type)) return res.status(400).json({ message: "Invalid user role" });

    // Email validation
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email format" });
    const domain = email.split("@")[1];
    if (disposableDomains.includes(domain)) return res.status(400).json({ message: "Disposable email addresses are not allowed" });

    // Password validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[\W_]/.test(password) ||
      weakPasswords.includes(password.toLowerCase())
    ) {
      return res.status(400).json({
        message: "Password must be at least 8 chars, include uppercase, lowercase, number, special char, and not be common"
      });
    }

    // Full name validation
    if (!validator.isLength(full_name, { min: 2, max: 100 }) || !/^[A-Za-z ]+$/.test(full_name)) {
      return res.status(400).json({ message: "Name must be 2-100 letters only" });
    }

    // Phone validation
    if (phone && !validator.isMobilePhone(phone, "any")) return res.status(400).json({ message: "Invalid phone number" });

    // Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ user_type, email, password_hash: hashedPassword, full_name, phone });

    // Employee-specific validation & creation
    if (user_type === "employee") {
      const requiredFields = ["join_date", "date_of_birth", "gender", "marital_status", "address", "emergency_contact_name", "emergency_contact_phone"];
      for (let field of requiredFields) {
        if (!employeeData[field]) {
          return res.status(400).json({ message: `Field ${field} is required for employees` });
        }
      }

      // Date validations
      if (!validator.isDate(employeeData.join_date) || new Date(employeeData.join_date) > new Date()) {
        return res.status(400).json({ message: "Join date must be valid and not in the future" });
      }
      if (!validator.isDate(employeeData.date_of_birth)) {
        return res.status(400).json({ message: "Invalid date of birth" });
      }
      const age = new Date().getFullYear() - new Date(employeeData.date_of_birth).getFullYear();
      if (age < 18 || age > 65) return res.status(400).json({ message: "Employee age must be between 18 and 65" });

      // Gender & marital status validation
      const genders = ["male", "female", "other"];
      if (!genders.includes(employeeData.gender)) return res.status(400).json({ message: "Invalid gender" });
      const maritalOptions = ["single", "married", "divorced", "widowed"];
      if (!maritalOptions.includes(employeeData.marital_status)) return res.status(400).json({ message: "Invalid marital status" });

      // Emergency contact validation
      if (!/^[A-Za-z ]{2,100}$/.test(employeeData.emergency_contact_name)) {
        return res.status(400).json({ message: "Emergency contact name must be 2-100 letters only" });
      }
      if (!validator.isMobilePhone(employeeData.emergency_contact_phone, "any")) {
        return res.status(400).json({ message: "Invalid emergency contact phone" });
      }

      // Department validation
      // Replace this in register()
      const department = await Department.findByPk(employeeData.department_id);
      if (!department) return res.status(400).json({ message: "Selected department does not exist" });

      const designation = await Designation.findByPk(employeeData.designation_id);
      if (!designation) return res.status(400).json({ message: "Selected designation does not exist" });

      // Profile image upload (if file exists)
      let profileUrl = null;
      if (req.file) {
        profileUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "employees",
              timestamp: Math.floor(Date.now() / 1000) // Use current timestamp
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error.message); // Log detailed error
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      }

      // Create employee record
      await Employee.create({
        ...employeeData,
        profile_photo_url: profileUrl,
        user_id: user.id,
        department_id: department.id,
        employee_id: `EMP${new Date().getFullYear()}${user.id}`,
        designation_id: designation.id
      });
    }

    res.status(201).json({ message: "User registered successfully", user });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};



// ✅ Logout User with Token Blacklisting
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(400).json({ message: "No authorization header provided" });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Check if token is already blacklisted
    if (tokenBlacklist.isBlacklisted(token)) {
      return res.json({
        message: "Token was already revoked",
        success: true
      });
    }

    // Verify and decode token to get expiration time
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add token to blacklist with expiration time
      tokenBlacklist.addToken(token, decoded.exp * 1000); // Convert to milliseconds

      console.log(`User ${decoded.userId} logged out successfully`);

      res.json({
        message: "Logged out successfully",
        success: true,
        timestamp: new Date().toISOString(),
        user_id: decoded.userId
      });

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        // Token is expired but still add to blacklist for security
        tokenBlacklist.addToken(token, Date.now());
        return res.json({
          message: "Token was already expired, but logged out successfully",
          success: true
        });
      } else {
        return res.status(401).json({
          message: "Invalid token",
          error: jwtError.message
        });
      }
    }

  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

// ✅ Get User Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }, // Don't send password
      include: [
        {
          model: Employee,
          attributes: ['id', 'employee_id', 'date_of_birth', 'gender', 'marital_status', 'address', 'emergency_contact_name', 'emergency_contact_phone', 'join_date', 'confirmation_date', 'probation_period_months', 'employment_type', 'status', 'profile_photo_url'],
          include: [
            {
              model: Department,
              attributes: ['id', 'department_name', 'department_code']
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile retrieved successfully",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

// ✅ Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { full_name, phone, password } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and update user fields
    if (full_name) {
      if (!validator.isLength(full_name, { min: 2, max: 100 }) || !/^[A-Za-z ]+$/.test(full_name)) {
        return res.status(400).json({ message: "Name must be 2-100 letters only" });
      }
      user.full_name = full_name.trim();
    }

    if (phone) {
      if (!validator.isMobilePhone(phone, 'en-IN')) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      user.phone = phone;
    }

    if (password) {
      // Password validation
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[\W_]/.test(password) ||
        weakPasswords.includes(password.toLowerCase())
      ) {
        return res.status(400).json({
          message: "Password must be at least 8 chars, include uppercase, lowercase, number, special char, and not be common"
        });
      }

      // Hash new password
      user.password_hash = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Fetch updated user with employee data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Employee,
          attributes: ['id', 'employee_id', 'date_of_birth', 'gender', 'marital_status', 'address', 'emergency_contact_name', 'emergency_contact_phone', 'join_date', 'confirmation_date', 'probation_period_months', 'employment_type', 'status', 'profile_photo_url'],
          include: [
            {
              model: Department,
              attributes: ['id', 'department_name', 'department_code']
            }
          ]
        }
      ]
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, role: user.user_type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};