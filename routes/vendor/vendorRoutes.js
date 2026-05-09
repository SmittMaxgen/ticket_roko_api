const express = require("express");
const router = express.Router();

const {
  createVendor,
  getMyVendor,
  updateVendor, // ← New
} = require("./../../controllers/vendor/vendorController");

const verifyToken = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

// Public Vendor Routes (for logged-in vendors)
router.post("/", verifyToken, createVendor);
router.patch("/me", verifyToken, updateVendor); // ← PATCH route added
router.get("/me", verifyToken, getMyVendor);

module.exports = router;
