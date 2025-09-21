import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Department from "../models/userModels/department.model.js"

const Designation = sequelize.define(
  "Designation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    designation_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "departments",
        key: "id",
      },
    },
    level: {
      type: DataTypes.ENUM(
        "junior",
        "mid",
        "senior",
        "lead",
        "manager",
        "director"
      ),
      allowNull: false,
    },
    min_salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
    max_salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
    job_description: {
      type: DataTypes.TEXT,
    },
    required_experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "designations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
Designation.belongsTo(Department, { foreignKey: "department_id" });

export default Designation;
