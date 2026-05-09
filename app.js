// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import router from "./routes/server.js";
// import { connectDB } from "./config/db.js";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 4000;

// app.use(cors({ origin: "*", credentials: true }));
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));
// app.use("/api", router);

// (async () => {
//   await connectDB(); // connect before server starts
//   app.listen(port, () => {
//     console.log(`🚀 App running on port http://localhost:${port}`);
//   });
// })();

// app.js
  
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const router = require("./routes/server");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", router);

(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 App running on http://localhost:${port}`);
  });
})();
