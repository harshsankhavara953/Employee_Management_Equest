import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cors from 'cors';


import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import designationRoutes from "./routes/designation.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveTypeRoutes from "./routes/leaveType.routes.js";
import leaveApplicationRoutes from "./routes/leaveApplication.routes.js";
import salaryDetailRoutes from "./routes/salaryDetail.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import performanceReviewRoutes from "./routes/performanceReview.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/performance-reviews", performanceReviewRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/salary-details", salaryDetailRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/leave-applications", leaveApplicationRoutes);
app.use("/api/analytics", analyticsRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Employee Management System API is running 🚀" });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await sequelize.sync({ alter: false }); // auto-create/update tables

    console.log("✅ Models synchronized!");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
