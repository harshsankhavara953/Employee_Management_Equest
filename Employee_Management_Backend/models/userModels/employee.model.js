import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./user.model.js";
import Department from "./department.model.js";
import Designation from "../designation.model.js";


const Employee = sequelize.define("Employee", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  employee_id: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  department_id: { type: DataTypes.INTEGER, allowNull: false },
  designation_id: { type: DataTypes.INTEGER, allowNull: false },
  manager_id: { type: DataTypes.INTEGER, allowNull: true },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM("male", "female", "other") },
  marital_status: { type: DataTypes.ENUM("single", "married", "divorced", "widowed") },
  address: { type: DataTypes.TEXT },
  emergency_contact_name: { type: DataTypes.STRING(100) },
  emergency_contact_phone: { type: DataTypes.STRING(15) },
  join_date: { type: DataTypes.DATEONLY, allowNull: false },
  confirmation_date: { type: DataTypes.DATEONLY },
  probation_period_months: { type: DataTypes.INTEGER, defaultValue: 6 },
  employment_type: {
    type: DataTypes.ENUM("permanent", "contract", "intern", "consultant"),
    defaultValue: "permanent"
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "terminated", "resigned"),
    defaultValue: "active"
  },
  profile_photo_url: { type: DataTypes.STRING(255) },
}, {
  timestamps: true,
  tableName: "employees",
  createdAt: "created_at",
  updatedAt: "updated_at"
});

// Relations
Employee.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasOne(Employee, { foreignKey: "user_id", onDelete: "CASCADE" });

Employee.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(Employee, { foreignKey: "department_id" });

Employee.belongsTo(Employee, { as: "manager", foreignKey: "manager_id" });
Employee.hasMany(Employee, { as: "subordinates", foreignKey: "manager_id" });

Employee.belongsTo(Designation, { foreignKey: "designation_id" });
Designation.hasMany(Employee, { foreignKey: "designation_id" });

export default Employee;
