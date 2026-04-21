// controllers/hall-row/hallRowController.js

const HallRow = require("../../models/hall/HallRowModel");

// GET /api/hall-rows
exports.getRows = async (req, res) => {
  try {
    const rows = await HallRow.findAll({
      order: [
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/hall-rows/:id
exports.getRowById = async (req, res) => {
  try {
    const row = await HallRow.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Hall row not found",
      });
    }

    return res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/hall-rows
exports.createRow = async (req, res) => {
  try {
    const row = await HallRow.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Hall row created successfully",
      data: row,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/hall-rows/:id
exports.updateRow = async (req, res) => {
  try {
    const row = await HallRow.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Hall row not found",
      });
    }

    await row.update(req.body);

    return res.json({
      success: true,
      message: "Hall row updated successfully",
      data: row,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/hall-rows/:id
exports.deleteRow = async (req, res) => {
  try {
    const row = await HallRow.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Hall row not found",
      });
    }

    await row.destroy();

    return res.json({
      success: true,
      message: "Hall row deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
