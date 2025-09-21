  import { DataTypes } from "sequelize";
  import sequelize from "../../config/db.js";
  import User from "./user.model.js";

  const Department = sequelize.define("Department", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    department_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    tableName: "departments",
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  // Relations: Department belongs to a manager (User)
  Department.belongsTo(User, { as: "manager", foreignKey: "manager_id" });
  User.hasMany(Department, { as: "managedDepartments", foreignKey: "manager_id" });

  export default Department;
