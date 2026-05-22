const express = require("express");
const path = require("path");

const router = express.Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

// Upload middleware
const uploadEventBanner = require("../../middleware/uploadEventBanner");

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
  getTrendingEvents,
  getAssignedEvents,
  assignTicketCheckerToEvent,
  unassignTicketCheckerFromEvent,
  scanEventTicket,
  getEventBySlug,
  getTrendingEventByIdOrSlug,
} = require("../../controllers/event/eventController");

const { updateSeatLabels } = require("../../controllers/hall/hallController");

/* PUBLIC / BASIC */
router.get("/", getAllEvents);

router.get("/trending", getTrendingEvents);

router.get("/trending/:id", getTrendingEventByIdOrSlug);

router.get(
  "/assigned",
  auth,
  role("super_admin", "admin", "ticket_checker"),
  getAssignedEvents,
);

router.post(
  "/scan-ticket",
  auth,
  role("super_admin", "admin", "ticket_checker"),
  scanEventTicket,
);

router.get("/:id", getEventById);

router.get("/slug/:slug", getEventBySlug);

router.get("/:id/booking-layout", getBookingLayout);

router.patch("/:hallId/seats/label", updateSeatLabels);

router.get(
  "/:id/bookings",
  auth,
  role("super_admin", "admin", "ticket_checker"),
  getEventBookings,
);

/* ADMIN */

// Create Event
router.post(
  "/",
  auth,
  adminOnly,
  uploadEventBanner.single("banner"),
  createEvent,
);

// Update Event
router.put(
  "/:id",
  auth,
  adminOnly,
  uploadEventBanner.single("banner"),
  updateEvent,
);

// Delete Event
router.delete("/:id", auth, adminOnly, deleteEvent);

// Assign Ticket Checker
router.post(
  "/:id/assign-ticket-checker",
  auth,
  adminOnly,
  assignTicketCheckerToEvent,
);

// Unassign Ticket Checker
router.delete(
  "/:id/unassign-ticket-checker",
  auth,
  adminOnly,
  unassignTicketCheckerFromEvent,
);

/* STATUS ACTIONS */

router.patch("/:id/approve", auth, adminOnly, approveEvent);

router.patch("/:id/reject", auth, adminOnly, rejectEvent);

router.patch("/:id/cancel", auth, adminOnly, cancelEvent);

/* STATS */

router.get("/stats/summary/all", auth, adminOnly, getSummaryStats);

module.exports = router;
