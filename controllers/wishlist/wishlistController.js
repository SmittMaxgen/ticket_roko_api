// controllers/wishlist/wishlistController.js

const Wishlist = require("../../models/whishlist/WhishListModel");

// GET /api/wishlists
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { user_id: req.user.id },
      order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/wishlists/:id
exports.getWishlistItemById = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/wishlists
exports.addToWishlist = async (req, res) => {
  try {
    const { event_id } = req.body;

    const exists = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        event_id,
      },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already added to wishlist",
      });
    }

    const item = await Wishlist.create({
      user_id: req.user.id,
      event_id,
    });

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/wishlists/:id
exports.removeWishlistItem = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    await item.destroy();

    return res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/wishlists/event/:event_id
exports.removeByEvent = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        event_id: req.params.event_id,
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    await item.destroy();

    return res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
