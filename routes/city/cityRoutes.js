const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("../../controllers/city/cityController");

/* GET ALL */
router.get("/", getCities);

/* GET BY ID */
router.get("/:id", getCityById);

/* CREATE */
router.post("/", auth, adminOnly, createCity);

/* UPDATE */
router.put("/:id", auth, adminOnly, updateCity);

/* DELETE */
router.delete("/:id", auth, adminOnly, deleteCity);

module.exports = router;
