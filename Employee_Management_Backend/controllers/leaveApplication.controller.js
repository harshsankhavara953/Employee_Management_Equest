import LeaveApplication from "../models/leaveApplication.model.js";
import LeaveType from "../models/leaveType.model.js";
import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import { Op } from "sequelize";

// ✅ Apply for Leave
export const applyLeave = async (req, res) => {
  try {
    const { employee_id, leave_type_id, start_date, end_date, reason, is_emergency } = req.body;

    // Calculate total days
    const start = new Date(start_date);
    const end = new Date(end_date);
    const total_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await LeaveApplication.create({
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      reason,
      is_emergency,
      status: "pending"
    });

    res.status(201).json({ message: "Leave application submitted", data: leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Leave Applications
export const getAllLeaveApplications = async (req, res) => {
  try {
    const leaves = await LeaveApplication.findAll({
      include: [
        { model: Employee, attributes: ["id", "employee_id"] },
        { model: LeaveType, attributes: ["leave_type_name"] }
      ],
      order: [["created_at", "DESC"]]
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Leave Application by ID
export const getLeaveApplicationById = async (req, res) => {
  try {
    const leave = await LeaveApplication.findByPk(req.params.id, {
      include: [Employee, LeaveType]
    });
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Leave Application (before approval)
export const updateLeaveApplication = async (req, res) => {
  try {
    const leave = await LeaveApplication.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Only pending applications can be updated" });
    }

    await leave.update(req.body);
    res.json({ message: "Leave application updated", data: leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete / Cancel Leave Application
export const deleteLeaveApplication = async (req, res) => {
  try {
    const leave = await LeaveApplication.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    await leave.update({ status: "cancelled" });
    res.json({ message: "Leave application cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve Leave
export const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveApplication.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const approverRole = req.user.role;

    if (approverRole === "department_manager") {
      await leave.update({
        status: "approved_by_manager",
        approved_by_manager: req.user.employeeId,
        manager_approval_date: new Date(),
        manager_comments: req.body.comments || null
      });
    } else if (approverRole === "hr_manager") {
      if (leave.status !== "approved_by_manager") {
        return res.status(400).json({ message: "Manager approval required before HR approval" });
      }
      await leave.update({
        status: "approved_by_hr",
        approved_by_hr: req.user.employeeId,
        hr_approval_date: new Date(),
        hr_comments: req.body.comments || null
      });
    }

    res.json({ message: "Leave approved", data: leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reject Leave
export const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveApplication.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    await leave.update({
      status: "rejected",
      manager_comments: req.body.comments || null,
      hr_comments: req.body.comments || null
    });

    res.json({ message: "Leave rejected", data: leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Leave Applications for Employee
export const getEmployeeLeaveApplications = async (req, res) => {
  try {
    const leaves = await LeaveApplication.findAll({
      where: { employee_id: req.params.employeeId },
      include: [LeaveType]
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Pending Approvals
export const getPendingApprovals = async (req, res) => {
  console.log("Getting pending approvals");
  try {
    const leaves = await LeaveApplication.findAll({
      where: { status: "pending" },
      include: [
        {
          model: Employee,
          include: [
            {
              model: User, // 👈 include User inside Employee
              attributes: ["id", "full_name", "email"] // fetch only what you need
            }
          ]
        },
        {
          model: LeaveType,
          attributes: ["id", "leave_type_name"]
        }
      ]
    });
    res.json(leaves);
  } catch (err) {
    console.log("hello");
    res.status(500).json({ error: err.message });
  }
};

// ✅ Calculate Leave Balances
export const getLeaveBalances = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const currentYear = new Date().getFullYear();

    const leaveTypes = await LeaveType.findAll({ where: { is_active: true } });
    const applications = await LeaveApplication.findAll({
      where: {
        employee_id: employeeId,
        status: { [Op.in]: ["approved_by_hr"] },
        start_date: { [Op.gte]: new Date(`${currentYear}-01-01`) },
        end_date: { [Op.lte]: new Date(`${currentYear}-12-31`) }
      }
    });

    let balances = [];
    for (let type of leaveTypes) {
      const used = applications
        .filter(a => a.leave_type_id === type.id)
        .reduce((sum, a) => sum + a.total_days, 0);

      balances.push({
        leaveType: type.leave_type_name,
        entitled: type.annual_entitlement,
        used,
        available: type.annual_entitlement - used
      });
    }

    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
