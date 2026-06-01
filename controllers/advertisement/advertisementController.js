/*
  controllers/advertisementController.js
  Full CRUD + click/impression tracking for Advertisement.
*/

const { Op } = require("sequelize");
const Advertisement = require("../../models/advertisement/AdvertisementModel");

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a slug from a title string.
 * e.g. "Summer Sale 50% Off" → "summer-sale-50-off"
 */
function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * POST /api/advertisements
 * Create a new advertisement.
 */
const createAdvertisement = async (req, res) => {
  try {
    // ── Resolve uploaded file paths ──────────────────────────────────────────
    if (req.files?.image_url?.[0])
      req.body.image_url = req.files.image_url[0].path
        .replace(/\\/g, "/")
        .replace(/^.*uploads\//, "uploads/");
    if (req.files?.thumbnail_url?.[0])
      req.body.thumbnail_url = req.files.thumbnail_url[0].path.replace(
        /\\/g,
        "/",
      );

    const {
      title,
      slug,
      image_url,
      thumbnail_url,
      bg_color,
      tagline,
      description,
      badge_text,
      discount_text,
      terms_text,
      tags,
      placement,
      starts_at,
      ends_at,
      url_link,
      cta_text,
      sort_order,
      is_featured,
      is_active,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "title is required" });
    }

    const finalSlug = slug || toSlug(title);

    // Check slug uniqueness
    const existing = await Advertisement.findOne({
      where: { slug: finalSlug },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Slug "${finalSlug}" already exists. Provide a unique slug.`,
      });
    }

    const ad = await Advertisement.create({
      title,
      slug: finalSlug,
      image_url,
      thumbnail_url,
      bg_color,
      tagline,
      description,
      badge_text,
      discount_text,
      terms_text,
      tags: tags || [],
      placement,
      starts_at,
      ends_at,
      url_link,
      cta_text,
      sort_order: sort_order ?? 0,
      is_featured: is_featured ?? false,
      is_active: is_active ?? true,
      created_by: req.user?.id || null,
    });

    return res.status(201).json({ success: true, data: ad });
  } catch (error) {
    console.error("createAdvertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── READ ALL ──────────────────────────────────────────────────────────────────

/**
 * GET /api/advertisements
 * List all advertisements with optional filters.
 *
 * Query params:
 *   placement  – filter by placement slot
 *   is_active  – "true" | "false"
 *   is_featured – "true" | "false"
 *   active_only – "true" → only ads whose schedule is currently live
 *   search     – partial match on title / tagline
 *   page       – page number (default 1)
 *   limit      – items per page (default 20)
 */
const getAllAdvertisements = async (req, res) => {
  try {
    const {
      placement,
      is_active,
      is_featured,
      active_only,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    if (placement) where.placement = placement;
    if (is_active !== undefined) where.is_active = is_active === "true";
    if (is_featured !== undefined) where.is_featured = is_featured === "true";

    if (active_only === "true") {
      const now = new Date();
      where.is_active = true;
      where[Op.and] = [
        { [Op.or]: [{ starts_at: null }, { starts_at: { [Op.lte]: now } }] },
        { [Op.or]: [{ ends_at: null }, { ends_at: { [Op.gte]: now } }] },
      ];
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { tagline: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Advertisement.findAndCountAll({
      where,
      order: [
        ["is_featured", "DESC"],
        ["sort_order", "ASC"],
        ["created_at", "DESC"],
      ],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: rows,
    });
  } catch (error) {
    console.error("getAllAdvertisements error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── READ ONE ──────────────────────────────────────────────────────────────────

/**
 * GET /api/advertisements/:id
 * Fetch a single advertisement by primary key.
 */
const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const ad = isNumeric
      ? await Advertisement.findByPk(id)
      : await Advertisement.findOne({ where: { slug: id } });

    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    console.error("getAdvertisementById error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/advertisements/:id or slug
 * Fetch a single advertisement by slug.
 */

const getAdvertisementBySlug = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const ad = isNumeric
      ? await Advertisement.findByPk(id)
      : await Advertisement.findOne({ where: { slug: id } });

    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    console.error("getAdvertisementBySlug error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * PUT /api/advertisements/:id
 * Full update of an advertisement.
 */
const updateAdvertisement = async (req, res) => {
  try {
    // ── Resolve uploaded file paths ──────────────────────────────────────────
    if (req.files?.image_url?.[0])
      req.body.image_url = req.files.image_url[0].path
        .replace(/\\/g, "/")
        .replace(/^.*uploads\//, "uploads/");
    if (req.files?.thumbnail_url?.[0])
      req.body.thumbnail_url = req.files.thumbnail_url[0].path.replace(
        /\\/g,
        "/",
      );
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }

    // If slug is changing, check uniqueness
    if (req.body.slug && req.body.slug !== ad.slug) {
      const existing = await Advertisement.findOne({
        where: { slug: req.body.slug },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Slug "${req.body.slug}" already exists.`,
        });
      }
    }

    // If title changes and no explicit slug provided, auto-generate new slug
    if (req.body.title && !req.body.slug) {
      req.body.slug = toSlug(req.body.title);
    }

    await ad.update(req.body);
    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    console.error("updateAdvertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────────

/**
 * PATCH /api/advertisements/:id/toggle-active
 * Flip the is_active flag.
 */
const toggleActive = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    await ad.update({ is_active: !ad.is_active });
    return res.status(200).json({
      success: true,
      message: `Advertisement is now ${ad.is_active ? "active" : "inactive"}`,
      data: ad,
    });
  } catch (error) {
    console.error("toggleActive error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────

/**
 * POST /api/advertisements/:id/click
 * Increment click_count by 1.
 */
const trackClick = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    await ad.increment("click_count");
    return res
      .status(200)
      .json({ success: true, click_count: ad.click_count + 1 });
  } catch (error) {
    console.error("trackClick error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/advertisements/:id/impression
 * Increment impression_count by 1.
 */
const trackImpression = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    await ad.increment("impression_count");
    return res
      .status(200)
      .json({ success: true, impression_count: ad.impression_count + 1 });
  } catch (error) {
    console.error("trackImpression error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * DELETE /api/advertisements/:id
 * Hard-delete an advertisement.
 */
const deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    await ad.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("deleteAdvertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── EXPORTS ───────────────────────────────────────────────────────────────────

module.exports = {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  getAdvertisementBySlug,
  updateAdvertisement,
  toggleActive,
  trackClick,
  trackImpression,
  deleteAdvertisement,
};
