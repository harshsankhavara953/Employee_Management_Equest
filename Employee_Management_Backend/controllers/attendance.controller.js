import { Op } from "sequelize";
import Attendance from "../models/attendance.model.js";






// ✅ Employee Check-In
export const checkIn = async (req, res) => {
  try {
    const { employeeId, location } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const existing = await Attendance.findOne({ where: { employee_id: employeeId, date: today } });
    if (existing) return res.status(400).json({ message: "Already checked in today" });

    const record = await Attendance.create({
      employee_id: employeeId,
      date: today,
      check_in_time: new Date(),
      status: "present",
      work_location: location || "office",
    });

    res.json({ message: "Check-in successful", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Employee Check-Out
export const checkOut = async (req, res) => {
  try {
    const { employeeId, breakDuration = 0 } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const record = await Attendance.findOne({ where: { employee_id: employeeId, date: today } });
    if (!record) return res.status(404).json({ message: "No check-in found" });

    const checkIn = new Date(`${today}T${record.check_in_time}`);
    const checkOut = new Date();

    const totalHours = ((checkOut - checkIn) / 1000 / 3600) - (breakDuration / 60);
    const overtime = totalHours > 8 ? totalHours - 8 : 0;

    record.check_out_time = checkOut;
    record.break_duration = breakDuration;
    record.total_hours = totalHours.toFixed(2);
    record.overtime_hours = overtime.toFixed(2);
    record.late_arrival = checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 30);
    record.early_departure = totalHours < 8;

   await record.save();
   
    res.json({ message: "Check-out successful", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Employee Monthly Attendance
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.query;

    if (!id || !month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Invalid employee ID or month format (YYYY-MM)" });
    }

    const [year, m] = month.split("-");
    const startDate = `${year}-${m}-01`;
    const endDate = `${year}-${m}-30`; // Safe upper bound

    console.log(`Starting query for employee_id=${id}, date range: ${startDate} to ${endDate}`);

    const records = await Attendance.findAll({
      where: {
        employee_id: parseInt(id, 10), // Explicit integer parsing
        date: { [Op.between]: [startDate, endDate] },
      },
      raw: true, // Return raw data to avoid instance wrapping issues
    });

    console.log("Executed SQL query:", Attendance.sequelize.getQueryInterface().queryGenerator.selectQuery('attendance', {
      where: { employee_id: parseInt(id, 10), date: { [Op.between]: [startDate, endDate] } },
    }).slice(0, -1)); // Remove trailing semicolon for logging
    console.log(`Found ${records.length} records:`, records);

    if (records.length === 0) {
      console.warn("No records found, check database or query parameters");
    }

    const summary = {
      totalDays: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      leave: records.filter((r) => r.status === "on_leave").length,
      overtime: records.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0).toFixed(2),
      punctuality: records.length
        ? ((records.filter((r) => !r.late_arrival).length / records.length) * 100).toFixed(2) + "%"
        : "0%",
    };

    res.json({ records, summary });
  } catch (err) {
    console.error("Get attendance error:", err.stack);
    res.status(500).json({ error: "Server error fetching attendance", details: err.message });
  }
};

// ✅ Update Attendance (HR Manager only)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { check_in_time, check_out_time, status, work_location, break_duration, notes } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    // Validate status if provided
    const validStatuses = ["present", "absent", "late", "on_leave", "half_day"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update fields
    if (check_in_time !== undefined) attendance.check_in_time = check_in_time;
    if (check_out_time !== undefined) attendance.check_out_time = check_out_time;
    if (status !== undefined) attendance.status = status;
    if (work_location !== undefined) attendance.work_location = work_location;
    if (break_duration !== undefined) attendance.break_duration = break_duration;
    if (notes !== undefined) attendance.notes = notes;

    // Recalculate hours if check-in/out times are updated
    if (check_in_time || check_out_time) {
      if (attendance.check_in_time && attendance.check_out_time) {
        const checkIn = new Date(attendance.check_in_time);
        const checkOut = new Date(attendance.check_out_time);
        const totalHours = ((checkOut - checkIn) / 1000 / 3600) - (attendance.break_duration || 0) / 60;
        const overtime = totalHours > 8 ? totalHours - 8 : 0;

        attendance.total_hours = totalHours.toFixed(2);
        attendance.overtime_hours = overtime.toFixed(2);
        attendance.late_arrival = checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 30);
        attendance.early_departure = totalHours < 8;
      }
    }

    await attendance.save();
    res.json({ message: "Attendance updated successfully", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update attendance", error: err.message });
  }
};

// ✅ Get Department Attendance Summary
export const getDepartmentSummary = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { month } = req.query;

    if (!month) return res.status(400).json({ message: "Month parameter is required (YYYY-MM)" });

    const [year, m] = month.split("-");
    const startDate = `${year}-${m}-01`;
    const endDate = `${year}-${m}-31`;

    console.log(`Fetching summary for deptId=${deptId}, month=${month}, date range: ${startDate} to ${endDate}`);

    const Employee = (await import("../models/userModels/employee.model.js")).default;
    const employees = await Employee.findAll({
      where: { department_id: deptId },
      include: [{ model: (await import("../models/userModels/user.model.js")).default, attributes: ["full_name"] }]
    });

    console.log(`Found ${employees.length} employees:`, employees.map(e => ({ id: e.id, name: e.User?.full_name })));

    if (employees.length === 0) {
      return res.json({
        department_id: deptId,
        month: month,
        total_employees: 0,
        summary: {
          total_attendance_records: 0,
          present_days: 0,
          absent_days: 0,
          late_arrivals: 0,
          leave_days: 0,
          early_departures: 0,
          total_overtime: 0,
          average_punctuality: "0%"
        },
        employee_breakdown: []
      });
    }

    const employeeIds = employees.map(emp => emp.id);
    console.log("Employee IDs for query:", employeeIds);

    const Attendance = (await import("../models/attendance.model.js")).default;
    const attendanceRecords = await Attendance.findAll({
      where: {
        employee_id: { [Op.in]: employeeIds },
        date: { [Op.between]: [startDate, endDate] }
      }
    });

    console.log("Attendance query SQL:", Attendance.sequelize.getQueryInterface().queryGenerator.selectQuery('attendance', {
      where: { employee_id: { [Op.in]: employeeIds }, date: { [Op.between]: [startDate, endDate] } },
    }).slice(0, -1));
    console.log("Attendance query result:", attendanceRecords.map(r => ({ employee_id: r.employee_id, date: r.date, status: r.status })));
    console.log(`Found ${attendanceRecords.length} attendance records`);

    const summary = {
      total_attendance_records: attendanceRecords.length,
      present_days: attendanceRecords.filter(r => r.status === "present").length,
      absent_days: attendanceRecords.filter(r => r.status === "absent").length,
      late_arrivals: attendanceRecords.filter(r => r.late_arrival).length,
      leave_days: attendanceRecords.filter(r => r.status === "on_leave").length,
      early_departures: attendanceRecords.filter(r => r.early_departure).length,
      total_overtime: attendanceRecords.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0),
      average_punctuality: attendanceRecords.length > 0
        ? ((attendanceRecords.length - attendanceRecords.filter(r => r.late_arrival).length) / attendanceRecords.length * 100).toFixed(2) + "%"
        : "0%"
    };

    const employeeBreakdown = employees.map(employee => {
      const empRecords = attendanceRecords.filter(r => r.employee_id === employee.id);
      return {
        employee_id: employee.id,
        employee_name: employee.User?.full_name,
        total_days: empRecords.length,
        present_days: empRecords.filter(r => r.status === "present").length,
        absent_days: empRecords.filter(r => r.status === "absent").length,
        late_arrivals: empRecords.filter(r => r.late_arrival).length,
        total_overtime: empRecords.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0),
        punctuality: empRecords.length > 0
          ? ((empRecords.length - empRecords.filter(r => r.late_arrival).length) / empRecords.length * 100).toFixed(2) + "%"
          : "0%"
      };
    });

    res.json({
      department_id: deptId,
      month: month,
      total_employees: employees.length,
      summary,
      employee_breakdown: employeeBreakdown
    });
  } catch (err) {
    console.error("Error in getDepartmentSummary:", err.stack);
    res.status(500).json({ message: "Failed to fetch department summary", error: err.message });
  }
};

