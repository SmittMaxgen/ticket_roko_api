/*
  routes/label/labelRoutes.js
*/

const router = require("express").Router();
const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");
const uploadLabel = require("../../middleware/labelsUpload");

const {
  getLabels,
  getActiveLabels,
  getFeaturedLabels,
  getLabelById,
  getLabelBySlug,
  createLabel,
  updateLabel,
  toggleStatus,
  reorderLabels,
  deleteLabel,
} = require("../../controllers/label/labelController");

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/active", getActiveLabels);
router.get("/featured", getFeaturedLabels);
router.get("/slug/:slug", getLabelBySlug);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get("/", getLabels);
router.get("/:id", getLabelById);
router.post("/", auth, adminOnly, uploadLabel, createLabel);
router.put("/:id", auth, uploadLabel, updateLabel);
router.patch("/reorder", auth, reorderLabels);
router.patch("/:id/status", auth, adminOnly, toggleStatus);
router.delete("/:id", auth, adminOnly, deleteLabel);

module.exports = router;
