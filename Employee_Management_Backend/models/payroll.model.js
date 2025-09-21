import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "./userModels/employee.model.js";
import User from "./userModels/user.model.js";

const Payroll = sequelize.define(
  "Payroll",
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
    pay_period_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pay_period_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    working_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    present_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    absent_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paid_leaves: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unpaid_leaves: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    basic_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gross_earnings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_deductions: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    net_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    overtime_amount: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    bonus_amount: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.0,
    },
    payroll_status: {
      type: DataTypes.ENUM("draft", "processed", "paid"),
      defaultValue: "draft",
    },
    payment_date: {
      type: DataTypes.DATE,
    },
    payment_method: {
      type: DataTypes.ENUM("bank_transfer", "cheque", "cash"),
      defaultValue: "bank_transfer",
    },
    bank_reference: {
      type: DataTypes.STRING(100),
    },
    generated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    processed_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "payroll",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
Payroll.belongsTo(Employee, { foreignKey: "employee_id" });
Payroll.belongsTo(User, { foreignKey: "generated_by" });

export default Payroll;
