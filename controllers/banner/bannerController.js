// controllers/banner/bannerController.js

const Banner = require("../../models/banner/BannerModel");

// GET /api/banners
exports.getBanners = async (req, res) => {
  try {
    const where = {};

    if (req.query.position) where.position = req.query.position;
    if (req.query.is_active !== undefined)
      where.is_active = req.query.is_active;

    const banners = await Banner.findAll({
      where,
      order: [
        ["sort_order", "ASC"],
        ["id", "DESC"],
      ],
    });

    return res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/banners/:id
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.update(req.body);

    return res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.destroy();

    return res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
