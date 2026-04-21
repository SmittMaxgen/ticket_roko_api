// routes/hallSeat/hallSeatRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getHallSeats,
  getHallSeatById,
  createHallSeat,
  updateHallSeat,
  deleteHallSeat,
} = require("../../controllers/hallSeat/hallSeatController");

/* GET ALL */
router.get("/", auth, adminOnly, getHallSeats);

/* GET BY ID */
router.get("/:id", auth, adminOnly, getHallSeatById);

/* CREATE */
router.post("/", auth, adminOnly, createHallSeat);

/* UPDATE */
router.put("/:id", auth, adminOnly, updateHallSeat);

/* DELETE */
router.delete("/:id", auth, adminOnly, deleteHallSeat);

module.exports = router;
