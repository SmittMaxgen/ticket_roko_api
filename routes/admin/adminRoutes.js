// routes/adminDashboardRoutes.js

const router = require("express").Router();
const controller = require("../../controllers/admin/adminController");

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const adminOnly = role("super_admin", "admin");
router.use(auth, adminOnly);

router.get("/overview", controller.getOverview);
router.get("/revenue-chart", controller.getRevenueChart);
router.get("/top-events", controller.getTopEvents);
router.get("/recent-bookings", controller.getRecentBookings);
router.get("/category-stats", controller.getCategoryStats);

module.exports = router;
