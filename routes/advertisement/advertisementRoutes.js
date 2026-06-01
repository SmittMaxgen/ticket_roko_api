/*
  routes/advertisementRoutes.js
  All routes for Advertisement CRUD + analytics.

  Mount in app.js:
    const advertisementRoutes = require("./routes/advertisementRoutes");
    app.use("/api/advertisements", advertisementRoutes);
*/

const express = require("express");
const router = express.Router();

const {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  getAdvertisementBySlug,
  updateAdvertisement,
  toggleActive,
  trackClick,
  trackImpression,
  deleteAdvertisement,
} = require("../../controllers/advertisement/advertisementController");

const { createUploader } = require("../../middleware/advertisementUpload");

// Multer middleware — uploads/advertisement/ is auto-created by the service
const advertisementUpload = createUploader("advertisement");
const uploadFields = advertisementUpload.fields([
  { name: "image_url", maxCount: 1 },
  { name: "thumbnail_url", maxCount: 1 },
]);

// Sanity-check: fail fast at startup if multer didn't return a function
if (typeof uploadFields !== "function") {
  throw new Error(
    "[advertisementRoutes] uploadFields is not a function — check uploadService.js",
  );
}

// ── If you have auth / admin middleware, import here ─────────────────────────
// const { protect, isAdmin } = require("../middleware/authMiddleware");

// ────────────────────────────────────────────────────────────────────────────
//  COLLECTION ROUTES
// ────────────────────────────────────────────────────────────────────────────

/**
 * GET    /api/advertisements          → list all (with filters & pagination)
 * POST   /api/advertisements          → create a new advertisement
 */
router
  .route("/")
  .get(getAllAdvertisements)
  .post(/* protect, isAdmin, */ uploadFields, createAdvertisement);

// ────────────────────────────────────────────────────────────────────────────
//  SLUG LOOKUP  (must come before /:id so "slug" isn't parsed as an id)
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
//  ANALYTICS  (static paths — must come before /:id)
// ────────────────────────────────────────────────────────────────────────────

/**
 * POST  /api/advertisements/:id/click
 * POST  /api/advertisements/:id/impression
 * Works with both numeric id and slug.
 */
router.post("/:id/click", trackClick);
router.post("/:id/impression", trackImpression);

// ────────────────────────────────────────────────────────────────────────────
//  SINGLE ITEM — auto-detect id vs slug
//  GET/PUT/DELETE /api/advertisements/42
//  GET/PUT/DELETE /api/advertisements/summer-sale-50-off
// ────────────────────────────────────────────────────────────────────────────

router
  .route("/:id")
  .get(getAdvertisementById) // controller resolves id or slug
  .put(/* protect, isAdmin, */ uploadFields, updateAdvertisement)
  .delete(/* protect, isAdmin, */ deleteAdvertisement);

/**
 * PATCH  /api/advertisements/:id/toggle-active
 */
router.patch("/:id/toggle-active", /* protect, isAdmin, */ toggleActive);

// ────────────────────────────────────────────────────────────────────────────

module.exports = router;
