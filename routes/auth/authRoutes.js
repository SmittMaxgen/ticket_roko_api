// routes/auth/authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth/authController");

// middleware (create these if already available)
const verifyToken = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");
/*
BASE URL:
 /api/auth
*/

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Refresh token
router.post("/refresh", authController.refresh);

// Logout
router.post("/logout", authController.logout);

// Current logged in user
router.get("/me", verifyToken, authController.me);

// Change password
router.put("/change-password", verifyToken, authController.changePassword);

module.exports = router;
