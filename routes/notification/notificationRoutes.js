// routes/notification/notificationRoutes.js

const router = require("express").Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

const adminOnly = role("super_admin", "admin");

const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  sendNotification,
  deleteNotification,
} = require("../../controllers/notification/notificationController");

// protected admin routes
router.get("/", auth, adminOnly, getNotifications);
router.get("/:id", auth, adminOnly, getNotificationById);

router.post("/", auth, adminOnly, createNotification);
router.put("/:id", auth, adminOnly, updateNotification);

router.patch("/:id/send", auth, adminOnly, sendNotification);

router.delete("/:id", auth, adminOnly, deleteNotification);

module.exports = router;
