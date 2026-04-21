// controllers/category/categoryController.js

const { Category } = require("../../models");

/* GET ALL */
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.findAll({
      order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

/* GET BY ID */
exports.getCategoryById = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

/* CREATE */
exports.createCategory = async (req, res) => {
  try {
    let { name, slug, icon, color, is_active } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Auto-generate slug if not provided
    if (!slug || slug.trim() === "") {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    } else {
      slug = slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    // =========================
    // CHECK DUPLICATE SLUG
    // =========================

    const exists = await Category.findOne({
      where: { slug },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // =========================
    // CREATE CATEGORY
    // =========================

    const item = await Category.create({
      name: name.trim(),
      slug,
      icon: icon || null,
      color: color || "#6366f1",
      is_active: is_active !== undefined ? is_active : true,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

/* UPDATE */
exports.updateCategory = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await item.update(req.body);

    return res.json({
      success: true,
      message: "Category updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

/* DELETE */
exports.deleteCategory = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await item.destroy();

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
