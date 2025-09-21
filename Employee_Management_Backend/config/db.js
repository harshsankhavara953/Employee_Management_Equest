import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({
  path: './.env'
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "Loaded ✅" : "Missing ❌");

const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name
  process.env.DB_USER,      // username
  process.env.DB_PASS,      // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // optional
  }
);

export default sequelize;
