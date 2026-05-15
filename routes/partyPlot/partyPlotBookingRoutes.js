const express = require("express");

const router = express.Router();

const verifyToken = require("../../middleware/auth");

const ctrl = require("../../controllers/partyPlot/partyPlotBookingController");

// GET ALL
router.get("/", verifyToken, ctrl.getBookings);

// GET SINGLE
router.get("/:id", verifyToken, ctrl.getBookingById);

module.exports = router;
