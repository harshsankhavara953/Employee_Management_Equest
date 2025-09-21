import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "../models/userModels/employee.model.js";


const SalaryDetails = sequelize.define(
  "SalaryDetails",
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
      onDelete: "CASCADE",
    },
    basic_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    hra: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    da: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    medical_allowance: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    conveyance_allowance: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    special_allowance: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    gross_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pf_contribution: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    professional_tax: {
      type: DataTypes.DECIMAL(6, 2),
      defaultValue: 0.0,
    },
    income_tax: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    other_deductions: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    net_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    effective_from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    effective_to: {
      type: DataTypes.DATEONLY,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "salary_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
SalaryDetails.belongsTo(Employee, { foreignKey: "employee_id" });


export default SalaryDetails;
