// routes/banner/bannerRoutes.js

const router = require("express").Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

const adminOnly = role("super_admin", "admin");

const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../../controllers/banner/bannerController");

// public
router.get("/", getBanners);
router.get("/:id", getBannerById);

// admin protected
router.post("/", auth, adminOnly, createBanner);
router.put("/:id", auth, adminOnly, updateBanner);
router.delete("/:id", auth, adminOnly, deleteBanner);

module.exports = router;
