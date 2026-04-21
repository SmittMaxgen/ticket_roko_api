// controllers/hallSection/hallSectionController.js

const { HallSection } = require("../../models");

/* GET ALL */
exports.getHallSections = async (req, res) => {
  try {
    const data = await HallSection.findAll({
      order: [
        ["hall_id", "ASC"],
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hall sections",
    });
  }
};

/* GET SINGLE */
exports.getHallSectionById = async (req, res) => {
  try {
    const item = await HallSection.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Hall section not found",
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hall section",
    });
  }
};

/* CREATE */
exports.createHallSection = async (req, res) => {
  try {
    const { hall_id, name, color, sort_order, is_active } = req.body;

    // ===============================
    // VALIDATION
    // ===============================
    if (!hall_id) {
      return res.status(400).json({
        success: false,
        message: "hall_id is required",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    // Optional validations
    if (color && typeof color !== "string") {
      return res.status(400).json({
        success: false,
        message: "Color must be a string",
      });
    }

    if (sort_order !== undefined && isNaN(sort_order)) {
      return res.status(400).json({
        success: false,
        message: "sort_order must be a number",
      });
    }

    // ===============================
    // CREATE SECTION
    // ===============================
    const item = await HallSection.create({
      hall_id,
      name: name.trim(),
      color: color || "#6366f1",
      sort_order: sort_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    return res.status(201).json({
      success: true,
      message: "Hall section created successfully",
      data: item,
    });
  } catch (error) {
    console.log("error::::", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create hall section",
    });
  }
};

/* UPDATE */
exports.updateHallSection = async (req, res) => {
  try {
    const item = await HallSection.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Hall section not found",
      });
    }

    await item.update(req.body);

    return res.json({
      success: true,
      message: "Hall section updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update hall section",
    });
  }
};

/* DELETE */
exports.deleteHallSection = async (req, res) => {
  try {
    const item = await HallSection.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Hall section not found",
      });
    }

    await item.destroy();

    return res.json({
      success: true,
      message: "Hall section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete hall section",
    });
  }
};
