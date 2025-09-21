import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import Department from "../models/userModels/department.model.js";
import Attendance from "../models/attendance.model.js";
import LeaveApplication from "../models/leaveApplication.model.js";
import Payroll from "../models/payroll.model.js";
import PerformanceReview from "../models/performanceReview.model.js";
import SalaryDetails from "../models/salaryDetails.model.js";
import { Op } from "sequelize";

// ✅ Get Dashboard Analytics
export const getDashboard = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Overall Statistics
    const totalEmployees = await Employee.count({ where });
    const activeEmployees = await Employee.count({ where: { ...where, status: "active" } });
    const newHires = await Employee.count({
      where: {
        ...where,
        join_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      }
    });

    // Attendance Statistics
    const attendanceStats = await Attendance.findAll({
      attributes: [
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.col('id')), 'total_records'],
        [Attendance.sequelize.fn('AVG', Attendance.sequelize.col('total_hours')), 'avg_hours'],
        [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('late_arrival')), 'late_arrivals']
      ],
      where: {
        date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      raw: true
    });

    // Leave Statistics
    const leaveStats = await LeaveApplication.findAll({
      attributes: [
        [LeaveApplication.sequelize.fn('COUNT', LeaveApplication.sequelize.col('id')), 'total_applications'],
        [LeaveApplication.sequelize.fn('SUM', LeaveApplication.sequelize.col('total_days')), 'total_days']
      ],
      where: {
        application_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      raw: true
    });

    // Performance Statistics
    const performanceStats = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('id')), 'total_reviews'],
        [PerformanceReview.sequelize.fn('AVG', PerformanceReview.sequelize.col('overall_rating')), 'avg_rating']
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      raw: true
    });

    res.json({
      overview: {
        total_employees: totalEmployees,
        active_employees: activeEmployees,
        new_hires: newHires,
        attrition_rate: totalEmployees > 0 ? ((totalEmployees - activeEmployees) / totalEmployees * 100).toFixed(2) : 0
      },
      attendance: attendanceStats[0] || { total_records: 0, avg_hours: 0, late_arrivals: 0 },
      leave: leaveStats[0] || { total_applications: 0, total_days: 0 },
      performance: performanceStats[0] || { total_reviews: 0, avg_rating: 0 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Attendance Trends
export const getAttendanceTrends = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const months = Number(req.query.months) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where = {};
    if (department_id) where.department_id = department_id;

    const trends = await Attendance.findAll({
      attributes: [
        [Attendance.sequelize.fn('DATE_FORMAT', Attendance.sequelize.col('date'), '%Y-%m'), 'month'],
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.col('id')), 'total_records'],
        [Attendance.sequelize.fn('AVG', Attendance.sequelize.col('total_hours')), 'avg_hours'],
        [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('late_arrival')), 'late_arrivals'],
        [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('early_departure')), 'early_departures']
      ],
      where: {
        date: { [Op.gte]: startDate }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: [Attendance.sequelize.fn('DATE_FORMAT', Attendance.sequelize.col('date'), '%Y-%m')],
      order: [[Attendance.sequelize.fn('DATE_FORMAT', Attendance.sequelize.col('date'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Calculate attendance rate
    const trendsWithRate = trends.map(trend => ({
      ...trend,
      attendance_rate: trend.total_records > 0 ? ((trend.total_records - trend.late_arrivals) / trend.total_records * 100).toFixed(2) : 0
    }));

    res.json({
      trends: trendsWithRate,
      period: `${months} months`,
      summary: {
        avg_monthly_hours: trends.length > 0 ? (trends.reduce((sum, t) => sum + parseFloat(t.avg_hours || 0), 0) / trends.length).toFixed(2) : 0,
        total_late_arrivals: trends.reduce((sum, t) => sum + parseInt(t.late_arrivals || 0), 0),
        total_early_departures: trends.reduce((sum, t) => sum + parseInt(t.early_departures || 0), 0)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Headcount Analysis
export const getHeadcountAnalysis = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Department-wise headcount
    const departmentHeadcount = await Employee.findAll({
      attributes: [
        'department_id',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']
      ],
      where: { ...where, status: "active" },
      include: [{
        model: Department,
        attributes: ['department_name'],
        required: true
      }],
      group: ['department_id', 'Department.department_name'],
      raw: true
    });

    // Employment type distribution
    const employmentTypeDistribution = await Employee.findAll({
      attributes: [
        'employment_type',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('employment_type')), 'count']
      ],
      where: { ...where, status: "active" },
      group: ['employment_type'],
      raw: true
    });


    // Gender distribution
    const genderDistribution = await Employee.findAll({
      attributes: [
        'gender',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('gender')), 'count']
      ],
      where: { ...where, status: "active" },
      group: ['gender'],
      raw: true
    });

    // Age distribution
    const ageDistribution = await Employee.findAll({
      attributes: [
        [Employee.sequelize.fn('YEAR', Employee.sequelize.col('date_of_birth')), 'birth_year'],
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']
      ],
      where: { ...where, status: "active" },
      group: [Employee.sequelize.fn('YEAR', Employee.sequelize.col('date_of_birth'))],
      order: [[Employee.sequelize.fn('YEAR', Employee.sequelize.col('date_of_birth')), 'DESC']],
      raw: true
    });

    // Calculate age groups
    const currentYear = new Date().getFullYear();
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0
    };

    ageDistribution.forEach(item => {
      const age = currentYear - item.birth_year;
      if (age >= 18 && age <= 25) ageGroups['18-25'] += parseInt(item.count);
      else if (age >= 26 && age <= 35) ageGroups['26-35'] += parseInt(item.count);
      else if (age >= 36 && age <= 45) ageGroups['36-45'] += parseInt(item.count);
      else if (age >= 46 && age <= 55) ageGroups['46-55'] += parseInt(item.count);
      else if (age >= 56 && age <= 65) ageGroups['56-65'] += parseInt(item.count);
    });

    // Tenure analysis
    const tenureAnalysis = await Employee.findAll({
      attributes: [
        [Employee.sequelize.fn('DATEDIFF', Employee.sequelize.col('join_date'), 'NOW()'), 'days_tenure'],
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']
      ],
      where: { ...where, status: "active" },
      group: [Employee.sequelize.fn('DATEDIFF', Employee.sequelize.col('join_date'), 'NOW()')],
      raw: true
    });

    // Calculate tenure groups
    const tenureGroups = {
      '0-1 years': 0,
      '1-3 years': 0,
      '3-5 years': 0,
      '5-10 years': 0,
      '10+ years': 0
    };

    tenureAnalysis.forEach(item => {
      const years = parseInt(item.days_tenure) / 365;
      if (years <= 1) tenureGroups['0-1 years'] += parseInt(item.count);
      else if (years <= 3) tenureGroups['1-3 years'] += parseInt(item.count);
      else if (years <= 5) tenureGroups['3-5 years'] += parseInt(item.count);
      else if (years <= 10) tenureGroups['5-10 years'] += parseInt(item.count);
      else tenureGroups['10+ years'] += parseInt(item.count);
    });

    res.json({
      department_headcount: departmentHeadcount,
      employment_type_distribution: employmentTypeDistribution,
      gender_distribution: genderDistribution,
      age_groups: ageGroups,
      tenure_groups: tenureGroups,
      total_active_employees: departmentHeadcount.reduce((sum, item) => sum + parseInt(item.count), 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Performance Summary
export const getPerformanceSummary = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Overall performance statistics
    const performanceStats = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('id')), 'total_reviews'],
        [PerformanceReview.sequelize.fn('AVG', PerformanceReview.sequelize.col('overall_rating')), 'avg_rating'],
        [PerformanceReview.sequelize.fn('MIN', PerformanceReview.sequelize.col('overall_rating')), 'min_rating'],
        [PerformanceReview.sequelize.fn('MAX', PerformanceReview.sequelize.col('overall_rating')), 'max_rating']
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      raw: true
    });

    // Rating distribution
    const ratingDistribution = await PerformanceReview.findAll({
      attributes: [
        'overall_rating',
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('overall_rating')), 'count']
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: ['overall_rating'],
      order: [['overall_rating', 'ASC']],
      raw: true
    });

    // Department-wise performance
    const departmentPerformance = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('AVG', PerformanceReview.sequelize.col('overall_rating')), 'avg_rating'],
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('overall_rating')), 'review_count']
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        include: [{
          model: Department,
          attributes: ['department_name']
        }],
        required: true
      }],
      group: ['Employee.Department.department_name'],
      raw: true
    });

    // Top performers
    const topPerformers = await PerformanceReview.findAll({
      where: {
        review_status: "finalized",
        overall_rating: { [Op.gte]: 4.0 },
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        include: [
          { model: User, attributes: ["full_name", "email"] },
          { model: Department, attributes: ["department_name"] }
        ],
        required: true
      }],
      order: [["overall_rating", "DESC"]],
      limit: 10
    });

    // Performance trends by month
    const monthlyTrends = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('DATE_FORMAT', PerformanceReview.sequelize.col('review_period_end'), '%Y-%m'), 'month'],
        [PerformanceReview.sequelize.fn('AVG', PerformanceReview.sequelize.col('overall_rating')), 'avg_rating'],
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('overall_rating')), 'review_count']
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: [PerformanceReview.sequelize.fn('DATE_FORMAT', PerformanceReview.sequelize.col('review_period_end'), '%Y-%m')],
      order: [[PerformanceReview.sequelize.fn('DATE_FORMAT', PerformanceReview.sequelize.col('review_period_end'), '%Y-%m'), 'ASC']],
      raw: true
    });

    res.json({
      overall_stats: performanceStats[0] || { total_reviews: 0, avg_rating: 0, min_rating: 0, max_rating: 0 },
      rating_distribution: ratingDistribution,
      department_performance: departmentPerformance,
      top_performers: topPerformers,
      monthly_trends: monthlyTrends,
      year: year
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Attrition Analysis
export const getAttritionAnalysis = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Calculate attrition by month
    const monthlyAttrition = await Employee.findAll({
      attributes: [
        [Employee.sequelize.fn('DATE_FORMAT', Employee.sequelize.col('updated_at'), '%Y-%m'), 'month'],
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'attrition_count']
      ],
      where: {
        ...where,
        status: { [Op.in]: ["terminated", "resigned"] },
        updated_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      group: [Employee.sequelize.fn('DATE_FORMAT', Employee.sequelize.col('updated_at'), '%Y-%m')],
      order: [[Employee.sequelize.fn('DATE_FORMAT', Employee.sequelize.col('updated_at'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Attrition by reason
    const attritionByReason = await Employee.findAll({
      attributes: [
        'status',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('status')), 'count']
      ],
      where: {
        ...where,
        status: { [Op.in]: ["terminated", "resigned"] },
        updated_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      group: ['status'],
      raw: true
    });

    // Department-wise attrition
    const departmentAttrition = await Employee.findAll({
      attributes: [
        'department_id',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'attrition_count']
      ],
      where: {
        ...where,
        status: { [Op.in]: ["terminated", "resigned"] },
        updated_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Department,
        attributes: ['department_name'],
        required: true
      }],
      group: ['department_id', 'Department.department_name'],
      raw: true
    });

    // Calculate attrition rate
    const totalEmployees = await Employee.count({ where });
    const totalAttrition = monthlyAttrition.reduce((sum, item) => sum + parseInt(item.attrition_count), 0);
    const attritionRate = totalEmployees > 0 ? (totalAttrition / totalEmployees * 100).toFixed(2) : 0;

    res.json({
      monthly_attrition: monthlyAttrition,
      attrition_by_reason: attritionByReason,
      department_attrition: departmentAttrition,
      summary: {
        total_attrition: totalAttrition,
        attrition_rate: attritionRate,
        year: year
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Salary Distribution
export const getSalaryDistribution = async (req, res) => {
  try {
    const department_id = req.query.department_id;

    const where = {};
    if (department_id) where.department_id = department_id;

    // Current salary distribution
    const salaryStats = await SalaryDetails.findAll({
      attributes: [
        [SalaryDetails.sequelize.fn('AVG', SalaryDetails.sequelize.col('net_salary')), 'avg_salary'],
        [SalaryDetails.sequelize.fn('MIN', SalaryDetails.sequelize.col('net_salary')), 'min_salary'],
        [SalaryDetails.sequelize.fn('MAX', SalaryDetails.sequelize.col('net_salary')), 'max_salary'],
        [SalaryDetails.sequelize.fn('COUNT', SalaryDetails.sequelize.col('id')), 'count']
      ],
      where: { is_current: true },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      raw: true
    });

    // Salary ranges
    const salaryRanges = await SalaryDetails.findAll({
      attributes: [
        [SalaryDetails.sequelize.fn('COUNT', SalaryDetails.sequelize.col('id')), 'count']
      ],
      where: { is_current: true },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: [
        SalaryDetails.sequelize.literal(`
          CASE 
            WHEN net_salary < 300000 THEN '0-3L'
            WHEN net_salary < 500000 THEN '3-5L'
            WHEN net_salary < 800000 THEN '5-8L'
            WHEN net_salary < 1200000 THEN '8-12L'
            WHEN net_salary < 2000000 THEN '12-20L'
            ELSE '20L+'
          END
        `)
      ],
      raw: true
    });

    // Department-wise salary
    const departmentSalary = await SalaryDetails.findAll({
      attributes: [
        [SalaryDetails.sequelize.fn('AVG', SalaryDetails.sequelize.col('net_salary')), 'avg_salary'],
        [SalaryDetails.sequelize.fn('COUNT', SalaryDetails.sequelize.col('id')), 'count']
      ],
      where: { is_current: true },
      include: [{
        model: Employee,
        include: [{
          model: Department,
          attributes: ['department_name']
        }],
        required: true
      }],
      group: ['Employee.Department.department_name'],
      raw: true
    });

    res.json({
      salary_statistics: salaryStats[0] || { avg_salary: 0, min_salary: 0, max_salary: 0, count: 0 },
      salary_ranges: salaryRanges,
      department_salary: departmentSalary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Leave Utilization
export const getLeaveUtilization = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Leave utilization by type
    const leaveByType = await LeaveApplication.findAll({
      attributes: [
        'leave_type_id',
        [LeaveApplication.sequelize.fn('COUNT', LeaveApplication.sequelize.col('id')), 'applications'],
        [LeaveApplication.sequelize.fn('SUM', LeaveApplication.sequelize.col('total_days')), 'total_days']
      ],
      where: {
        application_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: ['leave_type_id'],
      raw: true
    });

    // Monthly leave trends
    const monthlyLeaveTrends = await LeaveApplication.findAll({
      attributes: [
        [LeaveApplication.sequelize.fn('DATE_FORMAT', LeaveApplication.sequelize.col('application_date'), '%Y-%m'), 'month'],
        [LeaveApplication.sequelize.fn('COUNT', LeaveApplication.sequelize.col('id')), 'applications'],
        [LeaveApplication.sequelize.fn('SUM', LeaveApplication.sequelize.col('total_days')), 'total_days']
      ],
      where: {
        application_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: [LeaveApplication.sequelize.fn('DATE_FORMAT', LeaveApplication.sequelize.col('application_date'), '%Y-%m')],
      order: [[LeaveApplication.sequelize.fn('DATE_FORMAT', LeaveApplication.sequelize.col('application_date'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Leave approval rates
    const approvalRates = await LeaveApplication.findAll({
      attributes: [
        'status',
        [LeaveApplication.sequelize.fn('COUNT', LeaveApplication.sequelize.col('status')), 'count']
      ],
      where: {
        application_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: ['status'],
      raw: true
    });

    res.json({
      leave_by_type: leaveByType,
      monthly_trends: monthlyLeaveTrends,
      approval_rates: approvalRates,
      year: year
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Payroll Summary
export const getPayrollSummary = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Monthly payroll summary
    const monthlyPayroll = await Payroll.findAll({
      attributes: [
        [Payroll.sequelize.fn('DATE_FORMAT', Payroll.sequelize.col('pay_period_end'), '%Y-%m'), 'month'],
        [Payroll.sequelize.fn('SUM', Payroll.sequelize.col('net_salary')), 'total_payroll'],
        [Payroll.sequelize.fn('AVG', Payroll.sequelize.col('net_salary')), 'avg_salary'],
        [Payroll.sequelize.fn('COUNT', Payroll.sequelize.col('id')), 'employee_count']
      ],
      where: {
        pay_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        where: where,
        required: true
      }],
      group: [Payroll.sequelize.fn('DATE_FORMAT', Payroll.sequelize.col('pay_period_end'), '%Y-%m')],
      order: [[Payroll.sequelize.fn('DATE_FORMAT', Payroll.sequelize.col('pay_period_end'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Department-wise payroll
    const departmentPayroll = await Payroll.findAll({
      attributes: [
        [Payroll.sequelize.fn('SUM', Payroll.sequelize.col('net_salary')), 'total_payroll'],
        [Payroll.sequelize.fn('AVG', Payroll.sequelize.col('net_salary')), 'avg_salary'],
        [Payroll.sequelize.fn('COUNT', Payroll.sequelize.col('id')), 'employee_count']
      ],
      where: {
        pay_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      include: [{
        model: Employee,
        include: [{
          model: Department,
          attributes: ['department_name']
        }],
        required: true
      }],
      group: ['Employee.Department.department_name'],
      raw: true
    });

    res.json({
      monthly_payroll: monthlyPayroll,
      department_payroll: departmentPayroll,
      year: year
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Compliance Reports
export const getComplianceReports = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    // Attendance compliance
    const attendanceCompliance = await Attendance.findAll({
      attributes: [
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.col('id')), 'total_records'],
        [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('late_arrival')), 'late_arrivals'],
        [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('early_departure')), 'early_departures']
      ],
      where: {
        date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      raw: true
    });

    // Leave compliance
    const leaveCompliance = await LeaveApplication.findAll({
      attributes: [
        [LeaveApplication.sequelize.fn('COUNT', LeaveApplication.sequelize.col('id')), 'total_applications'],
        [LeaveApplication.sequelize.fn('SUM', LeaveApplication.sequelize.col('total_days')), 'total_days']
      ],
      where: {
        application_date: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      raw: true
    });

    // Performance compliance
    const performanceCompliance = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('id')), 'total_reviews'],
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('review_status')), 'finalized_reviews']
      ],
      where: {
        review_period_end: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`)
        }
      },
      raw: true
    });

    res.json({
      attendance_compliance: attendanceCompliance[0] || { total_records: 0, late_arrivals: 0, early_departures: 0 },
      leave_compliance: leaveCompliance[0] || { total_applications: 0, total_days: 0 },
      performance_compliance: performanceCompliance[0] || { total_reviews: 0, finalized_reviews: 0 },
      year: year
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Predictive Analytics
export const getPredictiveAnalytics = async (req, res) => {
  try {
    // Flight risk analysis based on performance and attendance
    const flightRiskAnalysis = await Employee.findAll({
      attributes: [
        'id',
        'employee_id',
        'status',
        [Employee.sequelize.fn('DATEDIFF', Employee.sequelize.col('join_date'), 'NOW()'), 'tenure_days']
      ],
      where: { status: "active" },
      include: [
        {
          model: User,
          attributes: ["full_name", "email"]
        },
        {
          model: Department,
          attributes: ["department_name"]
        },
        {
          model: PerformanceReview,
          attributes: ["overall_rating"],
          where: { review_status: "finalized" },
          required: false,
          order: [["review_period_end", "DESC"]],
          limit: 1
        },
        {
          model: Attendance,
          attributes: [
            [Attendance.sequelize.fn('AVG', Attendance.sequelize.col('total_hours')), 'avg_hours'],
            [Attendance.sequelize.fn('SUM', Attendance.sequelize.col('late_arrival')), 'late_count']
          ],
          where: {
            date: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          },
          required: false
        }
      ],
      limit: 50
    });

    // Calculate flight risk scores
    const flightRiskEmployees = flightRiskAnalysis.map(employee => {
      const tenureYears = parseInt(employee.tenure_days) / 365;
      const performanceRating = employee.PerformanceReviews?.[0]?.overall_rating || 3.0;
      const avgHours = parseFloat(employee.Attendances?.[0]?.avg_hours || 8);
      const lateCount = parseInt(employee.Attendances?.[0]?.late_count || 0);

      // Simple flight risk calculation
      let riskScore = 0;
      if (tenureYears < 1) riskScore += 30; // New employees
      if (performanceRating < 3.0) riskScore += 25; // Low performance
      if (avgHours < 7) riskScore += 20; // Low attendance
      if (lateCount > 5) riskScore += 15; // Frequent late arrivals

      return {
        employee_id: employee.employee_id,
        full_name: employee.User?.full_name,
        department: employee.Department?.department_name,
        tenure_years: tenureYears.toFixed(1),
        performance_rating: performanceRating,
        avg_hours: avgHours,
        late_count: lateCount,
        flight_risk_score: riskScore,
        risk_level: riskScore > 50 ? "High" : riskScore > 30 ? "Medium" : "Low"
      };
    });

    res.json({
      flight_risk_analysis: flightRiskEmployees.sort((a, b) => b.flight_risk_score - a.flight_risk_score),
      summary: {
        high_risk: flightRiskEmployees.filter(e => e.risk_level === "High").length,
        medium_risk: flightRiskEmployees.filter(e => e.risk_level === "Medium").length,
        low_risk: flightRiskEmployees.filter(e => e.risk_level === "Low").length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Training Needs
export const getTrainingNeeds = async (req, res) => {
  try {
    // Identify training needs based on performance reviews
    const trainingNeeds = await PerformanceReview.findAll({
      attributes: [
        'employee_id',
        'technical_skills_rating',
        'soft_skills_rating',
        'areas_for_improvement'
      ],
      where: {
        review_status: "finalized",
        review_period_end: {
          [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      include: [{
        model: Employee,
        include: [
          { model: User, attributes: ["full_name", "email"] },
          { model: Department, attributes: ["department_name"] }
        ],
        required: true
      }],
      order: [["review_period_end", "DESC"]]
    });

    // Analyze training needs
    const needsAnalysis = trainingNeeds.map(review => {
      const needs = [];
      if (review.technical_skills_rating < 3) needs.push("Technical Skills");
      if (review.soft_skills_rating < 3) needs.push("Soft Skills");
      
      return {
        employee_id: review.Employee?.employee_id,
        full_name: review.Employee?.User?.full_name,
        department: review.Employee?.Department?.department_name,
        technical_rating: review.technical_skills_rating,
        soft_skills_rating: review.soft_skills_rating,
        training_needs: needs,
        improvement_areas: review.areas_for_improvement
      };
    });

    // Group by training needs
    const trainingCategories = {
      "Technical Skills": needsAnalysis.filter(n => n.training_needs.includes("Technical Skills")).length,
      "Soft Skills": needsAnalysis.filter(n => n.training_needs.includes("Soft Skills")).length,
      "Leadership": needsAnalysis.filter(n => n.improvement_areas?.toLowerCase().includes("leadership")).length,
      "Communication": needsAnalysis.filter(n => n.improvement_areas?.toLowerCase().includes("communication")).length
    };

    res.json({
      individual_needs: needsAnalysis,
      training_categories: trainingCategories,
      total_employees_needing_training: needsAnalysis.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Succession Planning
export const getSuccessionPlanning = async (req, res) => {
  try {
    // Identify high performers for succession planning
    const successionCandidates = await PerformanceReview.findAll({
      where: {
        review_status: "finalized",
        overall_rating: { [Op.gte]: 4.0 },
        review_period_end: {
          [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      include: [{
        model: Employee,
        include: [
          { model: User, attributes: ["full_name", "email"] },
          { model: Department, attributes: ["department_name"] }
        ],
        required: true
      }],
      order: [["overall_rating", "DESC"]]
    });

    // Analyze leadership potential
    const leadershipPipeline = successionCandidates.map(candidate => {
      const tenureYears = parseInt(candidate.Employee?.tenure_days || 0) / 365;
      const leadershipScore = candidate.overall_rating * 20 + (tenureYears > 3 ? 10 : 0);
      
      return {
        employee_id: candidate.Employee?.employee_id,
        full_name: candidate.Employee?.User?.full_name,
        department: candidate.Employee?.Department?.department_name,
        overall_rating: candidate.overall_rating,
        tenure_years: tenureYears.toFixed(1),
        leadership_score: leadershipScore,
        readiness_level: leadershipScore > 80 ? "Ready" : leadershipScore > 60 ? "Developing" : "Early Stage"
      };
    });

    // Department-wise succession planning
    const departmentSuccession = {};
    leadershipPipeline.forEach(candidate => {
      const dept = candidate.department;
      if (!departmentSuccession[dept]) {
        departmentSuccession[dept] = { ready: 0, developing: 0, early_stage: 0 };
      }
      departmentSuccession[dept][candidate.readiness_level.toLowerCase().replace(" ", "_")]++;
    });

    res.json({
      leadership_pipeline: leadershipPipeline.sort((a, b) => b.leadership_score - a.leadership_score),
      department_succession: departmentSuccession,
      summary: {
        ready_for_promotion: leadershipPipeline.filter(c => c.readiness_level === "Ready").length,
        developing_leaders: leadershipPipeline.filter(c => c.readiness_level === "Developing").length,
        early_stage: leadershipPipeline.filter(c => c.readiness_level === "Early Stage").length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};