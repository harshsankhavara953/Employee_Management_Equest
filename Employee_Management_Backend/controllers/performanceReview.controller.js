import PerformanceReview from "../models/performanceReview.model.js";
import Employee from "../models/userModels/employee.model.js";
import User from "../models/userModels/user.model.js";
import Department from "../models/userModels/department.model.js";
import { Op } from "sequelize";

// ✅ Create Performance Review
export const createPerformanceReview = async (req, res) => {
  try {
    const {
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      review_type,
      goal_achievement_rating,
      technical_skills_rating,
      soft_skills_rating,
      initiative_rating,
      overall_rating,
      strengths,
      areas_for_improvement,
      goals_for_next_period,
      reviewer_comments,
      employee_comments
    } = req.body;

    // Validate required fields
    if (!employee_id || !reviewer_id || !review_period_start || !review_period_end || !review_type) {
      return res.status(400).json({ message: "Employee ID, reviewer ID, review period, and review type are required" });
    }

    // Validate review type
    const validReviewTypes = ["annual", "mid_year", "probation", "project_based"];
    if (!validReviewTypes.includes(review_type)) {
      return res.status(400).json({ message: "Invalid review type" });
    }

    // Validate ratings (1-5 scale)
    const ratings = [goal_achievement_rating, technical_skills_rating, soft_skills_rating, initiative_rating];
    for (let rating of ratings) {
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ message: "All ratings must be between 1 and 5" });
      }
    }

    // Validate overall rating
    if (overall_rating && (overall_rating < 1.0 || overall_rating > 5.0)) {
      return res.status(400).json({ message: "Overall rating must be between 1.0 and 5.0" });
    }

    // Check if employee exists
    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if reviewer exists
    const reviewer = await Employee.findByPk(reviewer_id);
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found" });
    }

    // Check for duplicate review in same period
    const existingReview = await PerformanceReview.findOne({
      where: {
        employee_id,
        review_period_start,
        review_period_end,
        review_type
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: "Performance review already exists for this period" });
    }

    const review = await PerformanceReview.create({
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      review_type,
      goal_achievement_rating,
      technical_skills_rating,
      soft_skills_rating,
      initiative_rating,
      overall_rating,
      strengths,
      areas_for_improvement,
      goals_for_next_period,
      reviewer_comments,
      employee_comments,
      review_status: "draft"
    });

    // Fetch created review with relations
    const newReview = await PerformanceReview.findByPk(review.id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        },
        {
          model: Employee,
          as: "Reviewer",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        }
      ]
    });

    res.status(201).json({ message: "Performance review created successfully", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Performance Reviews
export const getAllPerformanceReviews = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const review_type = req.query.review_type;
    const review_status = req.query.review_status;
    const department_id = req.query.department_id;

    const where = {};
    if (review_type) where.review_type = review_type;
    if (review_status) where.review_status = review_status;

    const includeOptions = [
      {
        model: Employee,
        as: "Employee",
        include: [
          { model: User, attributes: ["full_name", "email"] },
          { model: Department, attributes: ["department_name"] }
        ]
      },
      {
        model: Employee,
        as: "Reviewer",
        include: [{ model: User, attributes: ["full_name", "email"] }]
      }
    ];

    // Filter by department if specified
    if (department_id) {
      includeOptions[0].where = { department_id };
    }

    const { rows, count } = await PerformanceReview.findAndCountAll({
      where,
      include: includeOptions,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page,
        lastPage: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Performance Review by ID
export const getPerformanceReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await PerformanceReview.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          include: [
            { model: User, attributes: ["full_name", "email"] },
            { model: Department, attributes: ["department_name"] }
          ]
        },
        {
          model: Employee,
          as: "Reviewer",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        }
      ]
    });

    if (!review) {
      return res.status(404).json({ message: "Performance review not found" });
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Reviews by Employee ID
export const getReviewsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const review_type = req.query.review_type;
    const review_status = req.query.review_status;

    const where = { employee_id: employeeId };
    if (review_type) where.review_type = review_type;
    if (review_status) where.review_status = review_status;

    const reviews = await PerformanceReview.findAll({
      where,
      include: [
        {
          model: Employee,
          as: "Reviewer",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        }
      ],
      order: [["review_period_end", "DESC"]]
    });

    // Calculate performance trends
    const performanceTrends = reviews.map(review => ({
      period: `${review.review_period_start} to ${review.review_period_end}`,
      overall_rating: review.overall_rating,
      review_type: review.review_type,
      review_status: review.review_status
    }));

    res.json({
      reviews,
      performance_trends: performanceTrends,
      total_reviews: reviews.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Performance Review
export const updatePerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const review = await PerformanceReview.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Performance review not found" });
    }

    // Prevent updates if review is finalized
    if (review.review_status === "finalized") {
      return res.status(400).json({ message: "Cannot update finalized review" });
    }

    // Validate ratings if provided
    const ratings = ["goal_achievement_rating", "technical_skills_rating", "soft_skills_rating", "initiative_rating"];
    for (let rating of ratings) {
      if (updateData[rating] && (updateData[rating] < 1 || updateData[rating] > 5)) {
        return res.status(400).json({ message: "All ratings must be between 1 and 5" });
      }
    }

    if (updateData.overall_rating && (updateData.overall_rating < 1.0 || updateData.overall_rating > 5.0)) {
      return res.status(400).json({ message: "Overall rating must be between 1.0 and 5.0" });
    }

    await review.update(updateData);

    // Fetch updated review with relations
    const updatedReview = await PerformanceReview.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        },
        {
          model: Employee,
          as: "Reviewer",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        }
      ]
    });

    res.json({ message: "Performance review updated successfully", review: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Performance Review
export const deletePerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await PerformanceReview.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Performance review not found" });
    }

    // Prevent deletion if review is finalized
    if (review.review_status === "finalized") {
      return res.status(400).json({ message: "Cannot delete finalized review" });
    }

    await review.destroy();
    res.json({ message: "Performance review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Finalize Review
export const finalizeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_comments } = req.body;

    const review = await PerformanceReview.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Performance review not found" });
    }

    // Check if review is ready for finalization
    if (review.review_status !== "submitted") {
      return res.status(400).json({ message: "Review must be submitted before finalization" });
    }

    // Update review status and employee comments
    await review.update({
      review_status: "finalized",
      employee_comments: employee_comments || review.employee_comments,
      acknowledgment_date: new Date()
    });

    // Fetch finalized review with relations
    const finalizedReview = await PerformanceReview.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        },
        {
          model: Employee,
          as: "Reviewer",
          include: [{ model: User, attributes: ["full_name", "email"] }]
        }
      ]
    });

    res.json({ message: "Performance review finalized successfully", review: finalizedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Performance Analytics Dashboard
export const getPerformanceAnalytics = async (req, res) => {
  try {
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    // Get overall statistics
    const totalReviews = await PerformanceReview.count({
      include: [{
        model: Employee,
        as: "Employee",
        where: where
      }]
    });

    const finalizedReviews = await PerformanceReview.count({
      where: { review_status: "finalized" },
      include: [{
        model: Employee,
        as: "Employee",
        where: where
      }]
    });

    // Rating distribution
    const ratingDistribution = await PerformanceReview.findAll({
      attributes: [
        'overall_rating',
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('overall_rating')), 'count']
      ],
      where: { review_status: "finalized" },
      include: [{
        model: Employee,
        as: "Employee",
        where: where,
        required: true
      }],
      group: ['overall_rating'],
      raw: true
    });

    // Department-wise performance
    const departmentPerformance = await PerformanceReview.findAll({
      attributes: [
        [PerformanceReview.sequelize.fn('AVG', PerformanceReview.sequelize.col('overall_rating')), 'avg_rating'],
        [PerformanceReview.sequelize.fn('COUNT', PerformanceReview.sequelize.col('overall_rating')), 'review_count']
      ],
      where: { review_status: "finalized" },
      include: [{
        model: Employee,
        as: "Employee",
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
      overview: {
        total_reviews: totalReviews,
        finalized_reviews: finalizedReviews,
        completion_rate: totalReviews > 0 ? (finalizedReviews / totalReviews * 100).toFixed(2) : 0
      },
      rating_distribution: ratingDistribution,
      department_performance: departmentPerformance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Top Performers
export const getTopPerformers = async (req, res) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const department_id = req.query.department_id;
    const year = req.query.year || new Date().getFullYear();

    const where = {};
    if (department_id) where.department_id = department_id;

    const topPerformers = await PerformanceReview.findAll({
      where: {
        review_status: "finalized",
        overall_rating: { [Op.gte]: 4.0 }
      },
      include: [{
        model: Employee,
        as: "Employee",
        where: where,
        include: [
          { model: User, attributes: ["full_name", "email"] },
          { model: Department, attributes: ["department_name"] }
        ]
      }],
      order: [["overall_rating", "DESC"]],
      limit
    });

    res.json({
      top_performers: topPerformers,
      count: topPerformers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Performance Trends
export const getPerformanceTrends = async (req, res) => {
  try {
    const employee_id = req.query.employee_id;
    const department_id = req.query.department_id;
    const months = Number(req.query.months) || 12;

    const where = { review_status: "finalized" };
    if (employee_id) where.employee_id = employee_id;

    const employeeWhere = {};
    if (department_id) employeeWhere.department_id = department_id;

    const trends = await PerformanceReview.findAll({
      where,
      include: [{
        model: Employee,
        as: "Employee",
        where: employeeWhere,
        include: [
          { model: User, attributes: ["full_name"] },
          { model: Department, attributes: ["department_name"] }
        ]
      }],
      order: [["review_period_end", "ASC"]],
      limit: months * 10 // Approximate limit
    });

    // Group by month and calculate averages
    const monthlyTrends = {};
    trends.forEach(review => {
      const month = review.review_period_end.slice(0, 7); // YYYY-MM
      if (!monthlyTrends[month]) {
        monthlyTrends[month] = {
          month,
          total_reviews: 0,
          avg_rating: 0,
          ratings: []
        };
      }
      monthlyTrends[month].total_reviews++;
      monthlyTrends[month].ratings.push(review.overall_rating);
    });

    // Calculate average ratings
    Object.values(monthlyTrends).forEach(trend => {
      trend.avg_rating = (trend.ratings.reduce((a, b) => a + b, 0) / trend.ratings.length).toFixed(2);
      delete trend.ratings; // Remove raw ratings array
    });

    res.json({
      trends: Object.values(monthlyTrends),
      period: `${months} months`,
      total_data_points: trends.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};