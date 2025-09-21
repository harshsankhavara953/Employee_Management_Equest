import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "../models/userModels/employee.model.js";

const Attendance = sequelize.define(
  "Attendance",
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_in_time: {
      type: DataTypes.TIME,
    },
    check_out_time: {
      type: DataTypes.TIME,
    },
    break_duration: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0,
    },
    total_hours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0.0,
    },
    overtime_hours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM(
        "present",
        "absent",
        "half_day",
        "on_leave",
        "holiday"
      ),
      allowNull: false,
    },
    work_location: {
      type: DataTypes.ENUM("office", "remote", "client_site"),
      defaultValue: "office",
    },
    late_arrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    early_departure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["employee_id", "date"], // to prevent duplicate attendance for same day
      },
    ],
  }
);

// Associations
Attendance.belongsTo(Employee, { foreignKey: "employee_id" });

export default Attendance;