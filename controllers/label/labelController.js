/*
  controllers/label/labelController.js
*/

const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const Label = require("../../models/label/LabelModel");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Returns relative path stored in DB:  "uploads/labels/filename.jpg"
const filePath = (file) =>
  file ? `uploads/labels/${file.filename}` : undefined;

// Deletes old file from disk when replacing
const removeFile = (relativePath) => {
  if (!relativePath) return;
  const abs = path.join(__dirname, "../../", relativePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

// tags can arrive as JSON string from multipart/form-data
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
};

// ─── GET /labels  (admin — all records) ──────────────────────────────────────
const getLabels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      is_active,
      is_featured,
      tag,
    } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { tagline: { [Op.like]: `%${search}%` } },
        { badge_text: { [Op.like]: `%${search}%` } },
      ];
    }
    if (is_active !== undefined) where.is_active = is_active === "true";
    if (is_featured !== undefined) where.is_featured = is_featured === "true";

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Label.findAndCountAll({
      where,
      order: [
        ["sort_order", "ASC"],
        ["created_at", "DESC"],
      ],
      limit: Number(limit),
      offset,
    });

    const filtered = tag
      ? rows.filter(
          (l) => Array.isArray(l.tags) && l.tags.includes(tag.toUpperCase()),
        )
      : rows;

    return res.status(200).json({
      success: true,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      data: filtered,
    });
  } catch (err) {
    console.error("getLabels error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /labels/active  (public — accordion feed) ───────────────────────────
const getActiveLabels = async (req, res) => {
  try {
    const labels = await Label.findAll({
      where: { is_active: true },
      order: [["sort_order", "ASC"]],
      attributes: [
        "id",
        "name",
        "slug",
        "tagline",
        "image_url",
        "thumbnail_url",
        "bg_color",
        "badge_text",
        "discount_text",
        "terms_text",
        "tags",
        "age_rating",
        "url_link",
        "cta_text",
        "is_featured",
      ],
    });
    return res.status(200).json({ success: true, data: labels });
  } catch (err) {
    console.error("getActiveLabels error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /labels/featured ─────────────────────────────────────────────────────
const getFeaturedLabels = async (req, res) => {
  try {
    const labels = await Label.findAll({
      where: { is_active: true, is_featured: true },
      order: [["sort_order", "ASC"]],
    });
    return res.status(200).json({ success: true, data: labels });
  } catch (err) {
    console.error("getFeaturedLabels error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /labels/:id ──────────────────────────────────────────────────────────
const getLabelById = async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.id);
    if (!label)
      return res
        .status(404)
        .json({ success: false, message: "Label not found" });
    return res.status(200).json({ success: true, data: label });
  } catch (err) {
    console.error("getLabelById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /labels/slug/:slug ───────────────────────────────────────────────────
const getLabelBySlug = async (req, res) => {
  try {
    const label = await Label.findOne({ where: { slug: req.params.slug } });
    if (!label)
      return res
        .status(404)
        .json({ success: false, message: "Label not found" });
    return res.status(200).json({ success: true, data: label });
  } catch (err) {
    console.error("getLabelBySlug error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── POST /labels ─────────────────────────────────────────────────────────────
const createLabel = async (req, res) => {
  try {
    const {
      name,
      slug,
      bg_color,
      tagline,
      description,
      badge_text,
      discount_text,
      terms_text,
      tags,
      age_rating,
      url_link,
      cta_text,
      sort_order,
      is_featured,
      is_active,
    } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "name is required" });

    const finalSlug = slug ? slug : slugify(name);

    const existing = await Label.findOne({ where: { slug: finalSlug } });
    if (existing)
      return res.status(409).json({
        success: false,
        message: `Slug "${finalSlug}" already exists`,
      });

    // ── Files uploaded by multer ──────────────────────────────────────────
    const image_url_path = filePath(req.files?.image_url?.[0]);
    const thumbnail_url_path = filePath(req.files?.thumbnail_url?.[0]);

    const label = await Label.create({
      name,
      slug: finalSlug,
      image_url: image_url_path ?? null,
      thumbnail_url: thumbnail_url_path ?? null,
      bg_color,
      tagline,
      description,
      badge_text,
      discount_text,
      terms_text,
      tags: parseTags(tags),
      age_rating,
      url_link,
      cta_text,
      sort_order: sort_order ?? 0,
      is_featured: is_featured ?? false,
      is_active: is_active ?? true,
      created_by: req.user?.id ?? null,
    });

    return res
      .status(201)
      .json({ success: true, message: "Label created", data: label });
  } catch (err) {
    console.error("createLabel error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── PUT /labels/:id ──────────────────────────────────────────────────────────
const updateLabel = async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.id);
    if (!label)
      return res
        .status(404)
        .json({ success: false, message: "Label not found" });
    console.log("label", label);
    const {
      name,
      slug,
      bg_color,
      tagline,
      description,
      badge_text,
      discount_text,
      terms_text,
      tags,
      age_rating,
      url_link,
      cta_text,
      sort_order,
      is_featured,
      is_active,
    } = req.body;

    if (slug && slug !== label.slug) {
      const conflict = await Label.findOne({ where: { slug } });
      if (conflict)
        return res
          .status(409)
          .json({ success: false, message: `Slug "${slug}" already in use` });
    }

    // ── Handle new uploads — delete old file from disk, store new path ────
    let newImageUrl = label.image_url;

    let newThumbnailUrl = label.thumbnail_url;

    if (req.files?.image_url?.[0]) {
      removeFile(label.image_url);
      newImageUrl = filePath(req.files.image_url[0]);
    }
    if (req.files?.thumbnail_url?.[0]) {
      removeFile(label.thumbnail_url);
      newThumbnailUrl = filePath(req.files.thumbnail_url[0]);
    }

    await label.update({
      name: name ?? label.name,
      slug: slug ?? label.slug,
      image_url: newImageUrl,
      thumbnail_url: newThumbnailUrl,
      bg_color: bg_color ?? label.bg_color,
      tagline: tagline ?? label.tagline,
      description: description ?? label.description,
      badge_text: badge_text ?? label.badge_text,
      discount_text: discount_text ?? label.discount_text,
      terms_text: terms_text ?? label.terms_text,
      tags: tags ? parseTags(tags) : label.tags,
      age_rating: age_rating ?? label.age_rating,
      url_link: url_link ?? label.url_link,
      cta_text: cta_text ?? label.cta_text,
      sort_order: sort_order ?? label.sort_order,
      is_featured: is_featured ?? label.is_featured,
      is_active: is_active ?? label.is_active,
    });

    return res
      .status(200)
      .json({ success: true, message: "Label updated", data: label });
  } catch (err) {
    console.error("updateLabel error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── PATCH /labels/:id/status ─────────────────────────────────────────────────
const toggleStatus = async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.id);
    if (!label)
      return res
        .status(404)
        .json({ success: false, message: "Label not found" });

    await label.update({ is_active: !label.is_active });
    return res.status(200).json({
      success: true,
      message: `Label ${label.is_active ? "activated" : "deactivated"}`,
      data: { id: label.id, is_active: label.is_active },
    });
  } catch (err) {
    console.error("toggleStatus error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── PATCH /labels/reorder ────────────────────────────────────────────────────
const reorderLabels = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "items array is required" });

    await Promise.all(
      items.map(({ id, sort_order }) =>
        Label.update({ sort_order }, { where: { id } }),
      ),
    );

    return res.status(200).json({ success: true, message: "Labels reordered" });
  } catch (err) {
    console.error("reorderLabels error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── DELETE /labels/:id ───────────────────────────────────────────────────────
const deleteLabel = async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.id);
    if (!label)
      return res
        .status(404)
        .json({ success: false, message: "Label not found" });

    // Also remove image files from disk
    removeFile(label.image_url);
    removeFile(label.thumbnail_url);

    await label.destroy();
    return res.status(200).json({ success: true, message: "Label deleted" });
  } catch (err) {
    console.error("deleteLabel error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
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
};
