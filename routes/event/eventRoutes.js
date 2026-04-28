const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

const adminOnly = role("super_admin", "admin");

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  approveEvent,
  rejectEvent,
  cancelEvent,
  deleteEvent,
  getSummaryStats,
  getBookingLayout,
  getEventBookings,
} = require("../../controllers/event/eventController");

/* PUBLIC / BASIC */
router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.get("/:id/booking-layout", getBookingLayout);
router.get("/:id/bookings", getEventBookings);

/* ADMIN */
router.post("/", auth, adminOnly, createEvent);
router.put("/:id", auth, adminOnly, updateEvent);
router.delete("/:id", auth, adminOnly, deleteEvent);

/* STATUS ACTIONS */
router.patch("/:id/approve", auth, adminOnly, approveEvent);
router.patch("/:id/reject", auth, adminOnly, rejectEvent);
router.patch("/:id/cancel", auth, adminOnly, cancelEvent);

/* STATS */
router.get("/stats/summary/all", auth, adminOnly, getSummaryStats);

module.exports = router;
