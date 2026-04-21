// routes/wishlist/wishlistRoutes.js

const router = require("express").Router();

const auth = require("../../middleware/auth");

const {
  getWishlist,
  getWishlistItemById,
  addToWishlist,
  removeWishlistItem,
  removeByEvent,
} = require("../../controllers/wishlist/wishlistController");

// all protected user routes
router.get("/", auth, getWishlist);
router.get("/:id", auth, getWishlistItemById);

router.post("/", auth, addToWishlist);

router.delete("/:id", auth, removeWishlistItem);
router.delete("/event/:event_id", auth, removeByEvent);

module.exports = router;
