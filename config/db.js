// import mysql from "mysql2/promise";

// let connection;

// export async function connectDB() {
//   if (!connection) {
//     try {
//       connection = mysql.createPool({
//         host: "localhost",
//         user: "root",
//         password: "root",
//         port: "3306",
//         database: "ticket_roko",
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//       });
//       console.log("✅ MySQL Pool created");
//       // Test connection
//       await connection.query("SELECT 1");
//       console.log("✅ MySQL connected successfully");
//     } catch (error) {
//       console.error("❌ MySQL connection failed:", error.message);
//     }
//   }
//   return connection;
// }

// const mysql = require("mysql2/promise");

// let connection;

// async function connectDB() {
//   if (!connection) {
//     try {
//       connection = mysql.createPool({
//         host: "localhost",
//         user: "root",
//         password: "root",
//         port: "3306",
//         database: "ticket_roko",
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//       });

//       console.log("✅ MySQL Pool created");

//       await connection.query("SELECT 1");

//       console.log("✅ MySQL connected successfully");
//     } catch (error) {
//       console.error("❌ MySQL connection failed:", error.message);
//     }
//   }

//   return connection;
// }

// module.exports = { connectDB };

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ticket_roko", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: true,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected");

    // create / update tables automatically
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.log("❌ DB Error:", error.message);
  }
}

module.exports = { sequelize, connectDB };
