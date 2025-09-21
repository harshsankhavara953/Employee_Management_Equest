import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LeaveType = sequelize.define(
  "LeaveType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leave_type_name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    annual_entitlement: {
      type: DataTypes.INTEGER,
      allowNull: false, // number of days per year
    },
    max_consecutive_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    carry_forward_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    max_carry_forward_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    requires_medical_certificate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    applicable_gender: {
      type: DataTypes.ENUM("all", "male", "female"),
      defaultValue: "all",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "leave_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default LeaveType;
