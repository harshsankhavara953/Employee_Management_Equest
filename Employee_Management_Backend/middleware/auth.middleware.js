import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import tokenBlacklist from "../utils/tokenBlacklist.js";

dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if token is blacklisted (for logout functionality)
    if (tokenBlacklist.isBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ message: "Token does not contain a user ID" });
    }
    req.user = { id: decoded.userId, role: decoded.role }; // Explicitly set id and role
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};