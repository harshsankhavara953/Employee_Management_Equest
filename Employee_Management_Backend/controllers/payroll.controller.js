import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import Payroll from "../models/payroll.model.js";
import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import { fn, col, Op } from "sequelize";

import SalaryDetails from "../models/salaryDetails.model.js"; // Adjust the import path


// 🧮 Salary Calculation


// const calculateMonthlySalary = (salaryDetail, attendanceData, leaveData) => {
//   const { basic_salary, hra, da, medical_allowance, conveyance_allowance, special_allowance } = salaryDetail;

//   const grossSalary =
//     Number(basic_salary) +
//     Number(hra) +
//     Number(da) +
//     Number(medical_allowance) +
//     Number(conveyance_allowance) +
//     Number(special_allowance);

//   // Simple deduction example
//   const totalDeductions =
//     Number(salaryDetail.pf_contribution || 0) +
//     Number(salaryDetail.professional_tax || 0) +
//     Number(salaryDetail.income_tax || 0) +
//     Number(salaryDetail.other_deductions || 0);

//   const netSalary = grossSalary - totalDeductions;

//   return { hra, da, medical_allowance, conveyance_allowance, special_allowance, grossSalary, totalDeductions, netSalary };
// };

// export const generatePayroll = async (req, res) => {
//   try {
//     const {
//       employee_id,
//       pay_period_start,
//       pay_period_end,
//       working_days,
//       present_days,
//       absent_days,
//       paid_leaves,
//       unpaid_leaves,
//     } = req.body;

//     // ✅ Validate employee
//     const employee = await Employee.findByPk(employee_id);
//     if (!employee) return res.status(404).json({ message: "Employee not found" });

//     // ✅ Get Salary Details
//     const salaryDetail = await SalaryDetails.findOne({
//       where: { employee_id, is_current: true },
//     });
//     if (!salaryDetail) return res.status(404).json({ message: "Salary details not found" });

//     // ✅ Calculate salary
//     const attendanceData = { totalDays: working_days };
//     const leaveData = { unpaidLeaves: unpaid_leaves || 0 };

//     const {
//       hra,
//       da,
//       medical_allowance,
//       conveyance_allowance,
//       special_allowance,
//       grossSalary,
//       totalDeductions,
//       netSalary,
//     } = calculateMonthlySalary(salaryDetail, attendanceData, leaveData);

//     // ✅ Create Payroll (store all salary components)
//     const payroll = await Payroll.create({
//       employee_id,
//       pay_period_start,
//       pay_period_end,
//       working_days,
//       present_days,
//       absent_days,
//       paid_leaves,
//       unpaid_leaves,
//       basic_salary: salaryDetail.basic_salary,
//       hra,
//       da,
//       medical: medical_allowance,
//       conveyance: conveyance_allowance,
//       special_allowance,
//       gross_earnings: grossSalary,
//       total_deductions: totalDeductions,
//       net_salary: netSalary,
//       generated_by: req.user.id, // from authenticate middleware
//       payroll_status: "draft",
//     });

//     res.status(201).json({
//       message: "Payroll generated successfully",
//       payroll,
//     });
//   } catch (err) {
//     console.error("Payroll generation error:", err);
//     res.status(500).json({ message: "Failed to generate payroll", error: err.message });
//   }
// };

// // 📝 Helper: Generate Payslip PDF Buffer
// const generatePayslipPDF = (payroll, ytdSummary) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
//       let buffers = [];
//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));

//       // Header
//       doc.fontSize(18).text("Company XYZ Pvt Ltd", { align: "center" });
//       doc.moveDown();
//       doc.fontSize(14).text(`Payslip for ${payroll.pay_period_start} - ${payroll.pay_period_end}`, { align: "center" });
//       doc.moveDown();

//       // Employee Info
//       doc.fontSize(12).text(`Employee: ${payroll.Employee.first_name} ${payroll.Employee.last_name}`);
//       doc.text(`Employee ID: ${payroll.Employee.employee_id}`);
//       doc.moveDown();

//       // Earnings
//       doc.fontSize(14).text("Earnings", { underline: true });
//       doc.fontSize(12).text(`Basic Salary: ${payroll.basic_salary}`);
//       doc.text(`HRA: ${payroll.hra}`);
//       doc.text(`DA: ${payroll.da}`);
//       doc.text(`Medical Allowance: ${payroll.medical}`);
//       doc.text(`Conveyance: ${payroll.conveyance}`);
//       doc.text(`Special Allowances: ${payroll.special_allowance}`);
//       doc.text(`Gross Earnings: ${payroll.gross_earnings}`);
//       doc.moveDown();

//       // Deductions
//       doc.fontSize(14).text("Deductions", { underline: true });
//       doc.fontSize(12).text(`Total Deductions: ${payroll.total_deductions}`);
//       doc.moveDown();

//       // Net Salary
//       doc.fontSize(14).text(`Net Salary: ${payroll.net_salary}`, { underline: true });
//       doc.moveDown();

//       // Attendance
//       doc.fontSize(12).text(`Working Days: ${payroll.working_days}`);
//       doc.text(`Present Days: ${payroll.present_days}`);
//       doc.text(`Absent Days: ${payroll.absent_days}`);
//       doc.text(`Paid Leaves: ${payroll.paid_leaves}`);
//       doc.text(`Unpaid Leaves: ${payroll.unpaid_leaves}`);
//       doc.moveDown();

//       // YTD
//       doc.fontSize(14).text("Year-to-Date Summary", { underline: true });
//       doc.fontSize(12).text(`Gross: ${ytdSummary.gross}`);
//       doc.text(`Deductions: ${ytdSummary.deductions}`);
//       doc.text(`Net: ${ytdSummary.net}`);
//       doc.moveDown();

//       doc.text("This is a computer-generated payslip.", { align: "center" });

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

// export const getPayslip = async (req, res) => {
//   try {
//     const payroll = await Payroll.findByPk(req.params.payrollId, { include: [Employee, User] });
//     if (!payroll) return res.status(404).json({ message: "Payslip not found" });

//     const year = new Date(payroll.pay_period_start).getFullYear();
//     const ytdPayrolls = await Payroll.findAll({
//       where: {
//         employee_id: payroll.employee_id,
//         pay_period_start: { [Op.gte]: `${year}-01-01` },
//         pay_period_end: { [Op.lte]: `${year}-12-31` },
//       },
//     });

//     const ytdSummary = {
//       gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
//       deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
//       net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
//     };

//     const pdfBuffer = await generatePayslipPDF(payroll, ytdSummary);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=payslip_${payroll.id}.pdf`);
//     res.send(pdfBuffer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const calculateMonthlySalary = (salaryDetail, attendanceData, leaveData) => {
  const { basic_salary, hra, da, medical_allowance, conveyance_allowance, special_allowance } = salaryDetail;

  const grossSalary =
    Number(basic_salary) +
    Number(hra) +
    Number(da) +
    Number(medical_allowance) +
    Number(conveyance_allowance) +
    Number(special_allowance);

  const totalDeductions =
    Number(salaryDetail.pf_contribution || 0) +
    Number(salaryDetail.professional_tax || 0) +
    Number(salaryDetail.income_tax || 0) +
    Number(salaryDetail.other_deductions || 0);

  const netSalary = grossSalary - totalDeductions;

  return { grossSalary, totalDeductions, netSalary };
};

// ✅ Generate Payroll
export const generatePayroll = async (req, res) => {
  try {
    const {
      employee_id,
      pay_period_start,
      pay_period_end,
      working_days,
      present_days,
      absent_days,
      paid_leaves,
      unpaid_leaves,
    } = req.body;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const salaryDetail = await SalaryDetails.findOne({
      where: { employee_id, is_current: true },
    });
    if (!salaryDetail) return res.status(404).json({ message: "Salary details not found" });

    const attendanceData = { totalDays: working_days };
    const leaveData = { unpaidLeaves: unpaid_leaves || 0 };

    const { grossSalary, totalDeductions, netSalary } =
      calculateMonthlySalary(salaryDetail, attendanceData, leaveData);

    // 🚫 store only totals inside Payroll
    const payroll = await Payroll.create({
      employee_id,
      pay_period_start,
      pay_period_end,
      working_days,
      present_days,
      absent_days,
      paid_leaves,
      unpaid_leaves,
      basic_salary: salaryDetail.basic_salary,
      gross_earnings: grossSalary,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      generated_by: req.user.id,
      payroll_status: "draft",
    });

    res.status(201).json({
      message: "Payroll generated successfully",
      payroll,
    });
  } catch (err) {
    console.error("Payroll generation error:", err);
    res.status(500).json({ message: "Failed to generate payroll", error: err.message });
  }
};

// 📝 Helper: Generate Payslip PDF Buffer
const generatePayslipPDF = (payroll, salaryDetail, ytdSummary) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(18).text("Company equest Pvt Ltd", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Payslip for ${payroll.pay_period_start} - ${payroll.pay_period_end}`, { align: "center" });
      doc.moveDown();

      // Employee Info
      doc.text(`Employee ID: ${payroll.Employee.employee_id}`);
      doc.moveDown();

      // Earnings (breakup from SalaryDetails)
      doc.fontSize(14).text("Earnings", { underline: true });
      doc.fontSize(12).text(`Basic Salary: ${payroll.basic_salary}`);
      doc.text(`HRA: ${salaryDetail?.hra || 0}`);
      doc.text(`DA: ${salaryDetail?.da || 0}`);
      doc.text(`Medical Allowance: ${salaryDetail?.medical_allowance || 0}`);
      doc.text(`Conveyance: ${salaryDetail?.conveyance_allowance || 0}`);
      doc.text(`Special Allowances: ${salaryDetail?.special_allowance || 0}`);
      doc.text(`Gross Earnings: ${payroll.gross_earnings}`);
      doc.moveDown();

      // Deductions (from SalaryDetails)
      doc.fontSize(14).text("Deductions", { underline: true });
      doc.fontSize(12).text(`PF Contribution: ${salaryDetail?.pf_contribution || 0}`);
      doc.text(`Professional Tax: ${salaryDetail?.professional_tax || 0}`);
      doc.text(`Income Tax: ${salaryDetail?.income_tax || 0}`);
      doc.text(`Other Deductions: ${salaryDetail?.other_deductions || 0}`);
      doc.text(`Total Deductions: ${payroll.total_deductions}`);
      doc.moveDown();

      // Net Salary
      doc.fontSize(14).text(`Net Salary: ${payroll.net_salary}`, { underline: true });
      doc.moveDown();

      // Attendance
      doc.fontSize(12).text(`Working Days: ${payroll.working_days}`);
      doc.text(`Present Days: ${payroll.present_days}`);
      doc.text(`Absent Days: ${payroll.absent_days}`);
      doc.text(`Paid Leaves: ${payroll.paid_leaves}`);
      doc.text(`Unpaid Leaves: ${payroll.unpaid_leaves}`);
      doc.moveDown();

      // YTD
      doc.fontSize(14).text("Year-to-Date Summary", { underline: true });
      doc.fontSize(12).text(`Gross: ${ytdSummary.gross}`);
      doc.text(`Deductions: ${ytdSummary.deductions}`);
      doc.text(`Net: ${ytdSummary.net}`);
      doc.moveDown();

      doc.text("This is a computer-generated payslip.", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// ✅ Download Payslip (PDF)
export const getPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.payrollId, { include: [Employee, User] });
    if (!payroll) return res.status(404).json({ message: "Payslip not found" });

    const salaryDetail = await SalaryDetails.findOne({
      where: { employee_id: payroll.employee_id, is_current: true },
    });

    const year = new Date(payroll.pay_period_start).getFullYear();
    const ytdPayrolls = await Payroll.findAll({
      where: {
        employee_id: payroll.employee_id,
        pay_period_start: { [Op.gte]: `${year}-01-01` },
        pay_period_end: { [Op.lte]: `${year}-12-31` },
      },
    });

    const ytdSummary = {
      gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
      deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
      net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
    };

    const pdfBuffer = await generatePayslipPDF(payroll, salaryDetail, ytdSummary);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=payslip_${payroll.id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Generate Payroll


// ✅ Generate Payroll
// ✅ Get Payrolls by Employee
export const getPayrollByEmployee = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      where: { employee_id: req.params.employeeId },
      include: [Employee],
      order: [["pay_period_start", "DESC"]],
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Download Payslip (PDF)

// ✅ Email Payslip
// export const emailPayslip = async (req, res) => {
//   try {
//     const payroll = await Payroll.findByPk(req.params.payrollId, { include: [Employee, User] });
//     if (!payroll) return res.status(404).json({ message: "Payslip not found" });

//     const year = new Date(payroll.pay_period_start).getFullYear();
//     const ytdPayrolls = await Payroll.findAll({
//       where: {
//         employee_id: payroll.employee_id,
//         pay_period_start: { [Op.gte]: `${year}-01-01` },
//         pay_period_end: { [Op.lte]: `${year}-12-31` },
//       },
//     });

//     const ytdSummary = {
//       gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
//       deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
//       net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
//     };

//     const pdfBuffer = await generatePayslipPDF(payroll, ytdSummary);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: payroll.Employee.email,
//       subject: "Your Monthly Payslip",
//       text: `Dear ${payroll.Employee.first_name},\n\nPlease find attached your payslip.`,
//       attachments: [{ filename: `Payslip_${payroll.id}.pdf`, content: pdfBuffer }],
//     });

//     res.json({ message: "Payslip sent via email successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const emailPayslip = async (req, res) => {
//   try {
//     const payroll = await Payroll.findByPk(req.params.payrollId, {
//       include: [
//         { model: Employee, include: [User] } // 👈 nested include to bring User under Employee
//       ]
//     });

//     if (!payroll) return res.status(404).json({ message: "Payslip not found" });

//     const year = new Date(payroll.pay_period_start).getFullYear();
//     const ytdPayrolls = await Payroll.findAll({
//       where: {
//         employee_id: payroll.employee_id,
//         pay_period_start: { [Op.gte]: `${year}-01-01` },
//         pay_period_end: { [Op.lte]: `${year}-12-31` },
//       },
//     });

//     const ytdSummary = {
//       gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
//       deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
//       net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
//     };

//     const pdfBuffer = await generatePayslipPDF(payroll, ytdSummary);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     // ✅ Email from User model (not Employee)
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: payroll.Employee.User.email, // 👈 get email from associated User
//       subject: "Your Monthly Payslip",
//       text: `Dear ${payroll.Employee.User.full_name},\n\nPlease find attached your payslip.`,
//       attachments: [{ filename: `Payslip_${payroll.id}.pdf`, content: pdfBuffer }],
//     });

//     res.json({ message: "Payslip sent via email successfully" });
//   } catch (err) {
//     console.error("Email payslip error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const emailPayslip = async (req, res) => {
//   try {
//     const payroll = await Payroll.findByPk(req.params.payrollId, {
//       include: [{ model: Employee, include: [User] }]
//     });

//     if (!payroll) return res.status(404).json({ message: "Payslip not found" });

//     const year = new Date(payroll.pay_period_start).getFullYear();
//     const ytdPayrolls = await Payroll.findAll({
//       where: {
//         employee_id: payroll.employee_id,
//         pay_period_start: { [Op.gte]: `${year}-01-01` },
//         pay_period_end: { [Op.lte]: `${year}-12-31` },
//       },
//     });

//     const ytdSummary = {
//       gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
//       deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
//       net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
//     };

//     const pdfBuffer = await generatePayslipPDF(payroll, ytdSummary);

//     // ✅ SendGrid SMTP transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.sendgrid.net",
//       port: 587,
//       secure: false, // STARTTLS
//       auth: {
//         user: "apikey", // <- literally the word "apikey"
//         pass: process.env.SENDGRID_API_KEY, // your SendGrid API Key
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER, // must match a verified sender in SendGrid
//       to: payroll.Employee.User.email,
//       subject: "Your Monthly Payslip",
//       text: `Dear ${payroll.Employee.User.full_name},\n\nPlease find attached your payslip.`,
//       attachments: [{ filename: `Payslip_${payroll.id}.pdf`, content: pdfBuffer }],
//     });

//     res.json({ message: "Payslip sent via email successfully" });
//   } catch (err) {
//     console.error("Email payslip error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const emailPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.payrollId, {
      include: [{ model: Employee, include: [User] }]
    });

    if (!payroll) return res.status(404).json({ message: "Payslip not found" });

    // 🔹 Get Salary Details
    const salaryDetail = await SalaryDetails.findOne({
      where: { employee_id: payroll.employee_id, is_current: true },
    });

    const year = new Date(payroll.pay_period_start).getFullYear();
    const ytdPayrolls = await Payroll.findAll({
      where: {
        employee_id: payroll.employee_id,
        pay_period_start: { [Op.gte]: `${year}-01-01` },
        pay_period_end: { [Op.lte]: `${year}-12-31` },
      },
    });

    const ytdSummary = {
      gross: ytdPayrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
      deductions: ytdPayrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
      net: ytdPayrolls.reduce((s, p) => s + Number(p.net_salary), 0),
    };

    // 🔹 FIX: pass all three args
    const pdfBuffer = await generatePayslipPDF(payroll, salaryDetail, ytdSummary);

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: payroll.Employee.User.email,
      subject: "Your Monthly Payslip",
      text: `Dear ${payroll.Employee.User.full_name},\n\nPlease find attached your payslip.`,
      attachments: [{ filename: `Payslip_${payroll.id}.pdf`, content: pdfBuffer }],
    });

    res.json({ message: "Payslip sent via email successfully" });
  } catch (err) {
    console.error("Email payslip error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Payroll Summary (HR Dashboard)
// export const getPayrollSummary = async (req, res) => {
//   try {
//     const { month, year } = req.query;
//     let whereClause = {};

//     if (month && year) {
//       const start = new Date(year, month - 1, 1);
//       const end = new Date(year, month, 0);
//       whereClause.pay_period_start = { [Op.gte]: start };
//       whereClause.pay_period_end = { [Op.lte]: end };
//     }

//     const payrolls = await Payroll.findAll({ where: whereClause });

//     const summary = {
//       totalEmployees: payrolls.length,
//       totalGross: payrolls.reduce((s, p) => s + Number(p.gross_earnings), 0),
//       totalDeductions: payrolls.reduce((s, p) => s + Number(p.total_deductions), 0),
//       totalNet: payrolls.reduce((s, p) => s + Number(p.net_salary), 0),
//     };

//     res.json(summary);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getPayrollSummary = async (req, res) => {
  try {
    let { month, year } = req.query;

    // Default to current month/year if not provided
    const now = new Date();
    month = month ? parseInt(month) : now.getMonth() + 1; // JS months: 0-11
    year = year ? parseInt(year) : now.getFullYear();

    // Start and end dates for the month
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); // last day of month

    const summary = await Payroll.findOne({
      attributes: [
        [fn("COUNT", col("id")), "totalEmployees"],
        [fn("SUM", col("gross_earnings")), "totalGross"],
        [fn("SUM", col("total_deductions")), "totalDeductions"],
        [fn("SUM", col("net_salary")), "totalNet"]
      ],
      where: {
        pay_period_start: { [Op.gte]: start },
        pay_period_end: { [Op.lte]: end }
      },
      raw: true
    });

    // Convert nulls to 0
    const result = {
      totalEmployees: parseInt(summary.totalEmployees) || 0,
      totalGross: parseFloat(summary.totalGross) || 0,
      totalDeductions: parseFloat(summary.totalDeductions) || 0,
      totalNet: parseFloat(summary.totalNet) || 0
    };

    res.json(result);
  } catch (err) {
    console.error("Error fetching payroll summary:", err);
    res.status(500).json({ error: err.message });
  }
};