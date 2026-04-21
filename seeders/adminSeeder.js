/*
seeders/adminSeeder.js
Default Super Admin
Email: admin@halldesk.com
Password: Admin@123
*/

const bcrypt = require("bcryptjs");
const { User } = require("../models");

const adminSeeder = async () => {
  const email = "admin@halldesk.com";

  const existingAdmin = await User.findOne({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Super admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@halldesk.com",
    phone: "+91-9999999999",
    password_hash: hashedPassword,
    role: "super_admin",
    is_active: true,
    is_verified: true,
  });

  console.log("Super admin seeded successfully");
};

module.exports = adminSeeder;
