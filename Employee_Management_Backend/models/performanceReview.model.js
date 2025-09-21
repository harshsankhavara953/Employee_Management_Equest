import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "../models/userModels/employee.model.js";

const PerformanceReview = sequelize.define(
  "PerformanceReview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
    },
    review_period_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    review_period_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    review_type: {
      type: DataTypes.ENUM("annual", "mid_year", "probation", "project_based"),
      allowNull: false,
    },
    goal_achievement_rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    technical_skills_rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    soft_skills_rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    initiative_rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    overall_rating: {
      type: DataTypes.DECIMAL(3, 2),
      validate: { min: 1.0, max: 5.0 },
    },
    strengths: {
      type: DataTypes.TEXT,
    },
    areas_for_improvement: {
      type: DataTypes.TEXT,
    },
    goals_for_next_period: {
      type: DataTypes.TEXT,
    },
    reviewer_comments: {
      type: DataTypes.TEXT,
    },
    employee_comments: {
      type: DataTypes.TEXT,
    },
    review_status: {
      type: DataTypes.ENUM(
        "draft",
        "submitted",
        "acknowledged",
        "finalized"
      ),
      defaultValue: "draft",
    },
    review_date: {
      type: DataTypes.DATE,
    },
    acknowledgment_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "performance_reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
PerformanceReview.belongsTo(Employee, { foreignKey: "employee_id" });
PerformanceReview.belongsTo(Employee, {
  as: "Reviewer",
  foreignKey: "reviewer_id",
});

export default PerformanceReview;
