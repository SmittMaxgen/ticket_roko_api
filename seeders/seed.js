/*
seeders/seed.js
Master Seeder File
Run:
node seeders/seed.js
*/

require("dotenv").config();

const { sequelize } = require("../models");

const categorySeeder = require("./categorySeeder");
const adminSeeder = require("./adminSeeder");

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    await categorySeeder();
    await adminSeeder();

    console.log("All seeders executed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

runSeeder();
