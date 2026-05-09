const express = require("express");

const router = express.Router();

/* Auth */
router.use("/auth", require("./auth/authRoutes"));

/* Users */
router.use("/users", require("./user/userRoutes"));

/* Categories */
router.use("/categories", require("./category/categoryRoutes"));

/* Events */
router.use("/events", require("./event/eventRoutes"));

/* Bookings */
router.use("/bookings", require("./booking/bookingRoutes"));

/* Halls */
router.use("/halls", require("./hall/hallRoutes"));

/* Hall Sections */
router.use("/hall-sections", require("./hallSection/hallSectionRoutes"));

/* Hall Rows */
router.use("/hall-rows", require("./hallRow/hallRowRoutes"));

/* Hall Seats */
router.use("/hall-seats", require("./hallSeat/hallSeatRoutes"));

/* Banners */
router.use("/banners", require("./banner/bannerRoutes"));

/* Notifications */
router.use("/notifications", require("./notification/notificationRoutes"));

/* Wishlists */
router.use("/wishlists", require("./wishlist/wishlistRoutes"));

/* Admin */
router.use("/admin", require("./admin/adminRoutes"));

/* Roles */
router.use("/role", require("./role/roleRoutes"));
router.use("/vendor", require("./vendor/vendorRoutes"));

module.exports = router;
