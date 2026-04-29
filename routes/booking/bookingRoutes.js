// routes/adminBookingRoutes.js

const router = require("express").Router();
const controller = require("../../controllers/booking/bookingController");
// const { auth, adminOnly } = require("../middleware/auth");

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const adminOnly = role("super_admin", "admin");
// router.use(auth, adminOnly);

router.post("/create", auth, controller.createBooking);
router.get("/my-bookings", controller.getMyBookings);
router.get("/:id", auth, controller.getBookingById);
router.get("/", controller.getAllBookings);

router.get("/stats/summary", controller.getBookingStats);
router.patch("/:id/cancel", controller.cancelBooking);

module.exports = router;
