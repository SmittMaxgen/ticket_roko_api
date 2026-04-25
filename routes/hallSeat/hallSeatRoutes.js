// // routes/hallSeat/hallSeatRoutes.js

// const express = require("express");
// const router = express.Router();

// const auth = require("../../middleware/auth");
// const adminOnly = require("../../middleware/role")("super_admin", "admin");

// const {
//   getHallSeats,
//   getHallSeatById,
//   createHallSeat,
//   updateHallSeat,
//   deleteHallSeat,
// } = require("../../controllers/hallSeat/hallSeatController");

// /* GET ALL */
// router.get("/", auth, adminOnly, getHallSeats);

// /* GET BY ID */
// router.get("/:id", auth, adminOnly, getHallSeatById);

// /* CREATE */
// router.post("/", auth, adminOnly, createHallSeat);

// /* UPDATE */
// router.put("/:id", auth, adminOnly, updateHallSeat);

// /* DELETE */
// router.delete("/:id", auth, adminOnly, deleteHallSeat);

// module.exports = router;

// routes/seatRoutes.js
// routes/hallSeat/hallSeatRoutes.js

const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/hallSeat/hallSeatController");

const verifyToken = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

/*
BASE URL:
/api/seats
*/

// GET seats list ?hall_id=1
router.get("/", verifyToken, ctrl.getSeats);

// GET single seat
router.get("/:id", verifyToken, ctrl.getSeatById);

// CREATE single seat
router.post("/", verifyToken, adminOnly, ctrl.createSeat);

// BULK CREATE seats
router.post("/bulk", verifyToken, adminOnly, ctrl.bulkCreateSeats);

// UPDATE seat
router.put("/:id", verifyToken, adminOnly, ctrl.updateSeat);

// DELETE single seat
router.delete("/:id", verifyToken, adminOnly, ctrl.deleteSeat);

// CLEAR all seats of hall
router.delete("/hall/:hall_id", verifyToken, adminOnly, ctrl.clearHallSeats);

module.exports = router;
