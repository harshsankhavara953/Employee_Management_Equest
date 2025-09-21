import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "./userModels/employee.model.js";
import LeaveType from "../models/leaveType.model.js";

const LeaveApplication = sequelize.define(
  "LeaveApplication",
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
    leave_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "leave_types",
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    application_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved_by_manager",
        "approved_by_hr",
        "rejected",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    approved_by_manager: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "id",
      },
    },
    manager_approval_date: {
      type: DataTypes.DATE,
    },
    manager_comments: {
      type: DataTypes.TEXT,
    },
    approved_by_hr: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "id",
      },
    },
    hr_approval_date: {
      type: DataTypes.DATE,
    },
    hr_comments: {
      type: DataTypes.TEXT,
    },
    is_emergency: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    contact_during_leave: {
      type: DataTypes.STRING(15),
    },
    handover_notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "leave_applications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
LeaveApplication.belongsTo(Employee, { foreignKey: "employee_id" });
LeaveApplication.belongsTo(LeaveType, { foreignKey: "leave_type_id" });
LeaveApplication.belongsTo(Employee, {
  as: "ManagerApprover",
  foreignKey: "approved_by_manager",
});
LeaveApplication.belongsTo(Employee, {
  as: "HrApprover",
  foreignKey: "approved_by_hr",
});

export default LeaveApplication;
