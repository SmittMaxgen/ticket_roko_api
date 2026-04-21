// controllers/hallSeat/hallSeatController.js

const { HallSeat } = require("../../models");

/* GET ALL */
exports.getHallSeats = async (req, res) => {
  try {
    const data = await HallSeat.findAll({
      order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hall seats",
    });
  }
};

/* GET BY ID */
exports.getHallSeatById = async (req, res) => {
  try {
    const seat = await HallSeat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Hall seat not found",
      });
    }

    return res.json({
      success: true,
      data: seat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hall seat",
    });
  }
};

/* CREATE */
exports.createHallSeat = async (req, res) => {
  try {
    const { row_id, seat_number, seat_type, is_available, price, status } =
      req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!row_id) {
      return res.status(400).json({
        success: false,
        message: "row_id is required",
      });
    }

    if (!seat_number) {
      return res.status(400).json({
        success: false,
        message: "seat_number is required",
      });
    }

    // row_id must be number
    if (isNaN(row_id)) {
      return res.status(400).json({
        success: false,
        message: "row_id must be a valid number",
      });
    }

    // seat_number must be string or number
    if (typeof seat_number !== "string" && typeof seat_number !== "number") {
      return res.status(400).json({
        success: false,
        message: "seat_number must be string or number",
      });
    }

    // Optional validations
    if (seat_type && !["standard", "vip", "premium"].includes(seat_type)) {
      return res.status(400).json({
        success: false,
        message: "seat_type must be standard | vip | premium",
      });
    }

    if (is_available !== undefined && typeof is_available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_available must be boolean",
      });
    }

    if (price !== undefined && isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "price must be a number",
      });
    }

    // =========================
    // CHECK DUPLICATE SEAT
    // =========================
    const existingSeat = await HallSeat.findOne({
      where: {
        row_id,
        seat_number,
      },
    });

    if (existingSeat) {
      return res.status(409).json({
        success: false,
        message: "Seat already exists in this row",
      });
    }

    // =========================
    // CREATE SEAT
    // =========================
    const seat = await HallSeat.create({
      row_id,
      seat_number: String(seat_number).trim(),
      seat_type: seat_type || "standard",
      is_available: is_available !== undefined ? is_available : true,
      price: price || 0,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Hall seat created successfully",
      data: seat,
    });
  } catch (error) {
    console.error("Seat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create hall seat",
    });
  }
};

/* UPDATE */
exports.updateHallSeat = async (req, res) => {
  try {
    const seat = await HallSeat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Hall seat not found",
      });
    }

    await seat.update(req.body);

    return res.json({
      success: true,
      message: "Hall seat updated successfully",
      data: seat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update hall seat",
    });
  }
};

/* DELETE */
exports.deleteHallSeat = async (req, res) => {
  try {
    const seat = await HallSeat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Hall seat not found",
      });
    }

    await seat.destroy();

    return res.json({
      success: true,
      message: "Hall seat deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete hall seat",
    });
  }
};
