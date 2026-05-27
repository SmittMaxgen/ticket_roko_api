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
const path = require("path");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", router);

(async () => {
  await connectDB();

  const http = require("http");
  const { Server } = require("socket.io");

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join:event", (eventId) => {
      socket.join(`event:${eventId}`);
      console.log(`Socket ${socket.id} joined event room: event:${eventId}`);
    });
    socket.on("leave:event", (eventId) => {
      socket.leave(`event:${eventId}`);
      console.log(`Socket ${socket.id} left event room: event:${eventId}`);
    });
  });

  app.set("io", io); // make io accessible in controllers

  server.listen(port, () => {
    console.log(`🚀 App running on http://localhost:${port}`);
  });
})();
