import LeaveType from "../models/leaveType.model.js";

// ✅ Create Leave Type
export const createLeaveType = async (req, res) => {
  try {
    const {
      leave_type_name,
      description,
      annual_entitlement,
      max_consecutive_days,
      carry_forward_allowed,
      max_carry_forward_days,
      requires_medical_certificate,
      is_paid,
      applicable_gender,
      is_active,
    } = req.body;

    // Check required fields
    if (!leave_type_name || !annual_entitlement) {
      return res.status(400).json({ message: "leave_type_name and annual_entitlement are required" });
    }

    const leaveType = await LeaveType.create({
      leave_type_name,
      description,
      annual_entitlement,
      max_consecutive_days,
      carry_forward_allowed,
      max_carry_forward_days,
      requires_medical_certificate,
      is_paid,
      applicable_gender,
      is_active,
    });

    res.status(201).json({ message: "Leave type created successfully", leaveType });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Leave type name must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Leave Types
export const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json(leaveTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Leave Type by ID
export const getLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findByPk(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    res.status(200).json({ leaveType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Leave Type
export const updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findByPk(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    const {
      leave_type_name,
      description,
      annual_entitlement,
      max_consecutive_days,
      carry_forward_allowed,
      max_carry_forward_days,
      requires_medical_certificate,
      is_paid,
      applicable_gender,
      is_active,
    } = req.body;

    await leaveType.update({
      leave_type_name: leave_type_name ?? leaveType.leave_type_name,
      description: description ?? leaveType.description,
      annual_entitlement: annual_entitlement ?? leaveType.annual_entitlement,
      max_consecutive_days: max_consecutive_days ?? leaveType.max_consecutive_days,
      carry_forward_allowed: carry_forward_allowed ?? leaveType.carry_forward_allowed,
      max_carry_forward_days: max_carry_forward_days ?? leaveType.max_carry_forward_days,
      requires_medical_certificate: requires_medical_certificate ?? leaveType.requires_medical_certificate,
      is_paid: is_paid ?? leaveType.is_paid,
      applicable_gender: applicable_gender ?? leaveType.applicable_gender,
      is_active: is_active ?? leaveType.is_active,
    });

    res.status(200).json({ message: "Leave type updated successfully", leaveType });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Leave type name must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Leave Type
export const deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findByPk(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    await leaveType.destroy();
    res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};