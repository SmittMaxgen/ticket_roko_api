// // controllers/hallSeat/hallSeatController.js

// const { HallSeat } = require("../../models");

// /* GET ALL */
// exports.getHallSeats = async (req, res) => {
//   try {
//     const data = await HallSeat.findAll({
//       order: [["id", "DESC"]],
//     });

//     return res.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch hall seats",
//     });
//   }
// };

// /* GET BY ID */
// exports.getHallSeatById = async (req, res) => {
//   try {
//     const seat = await HallSeat.findByPk(req.params.id);

//     if (!seat) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall seat not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: seat,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch hall seat",
//     });
//   }
// };

// /* CREATE */
// exports.createHallSeat = async (req, res) => {
//   try {
//     const { row_id, seat_number, seat_type, is_available, price, status } =
//       req.body;

//     // =========================
//     // VALIDATION
//     // =========================

//     if (!row_id) {
//       return res.status(400).json({
//         success: false,
//         message: "row_id is required",
//       });
//     }

//     if (!seat_number) {
//       return res.status(400).json({
//         success: false,
//         message: "seat_number is required",
//       });
//     }

//     // row_id must be number
//     if (isNaN(row_id)) {
//       return res.status(400).json({
//         success: false,
//         message: "row_id must be a valid number",
//       });
//     }

//     // seat_number must be string or number
//     if (typeof seat_number !== "string" && typeof seat_number !== "number") {
//       return res.status(400).json({
//         success: false,
//         message: "seat_number must be string or number",
//       });
//     }

//     // Optional validations
//     if (seat_type && !["standard", "vip", "premium"].includes(seat_type)) {
//       return res.status(400).json({
//         success: false,
//         message: "seat_type must be standard | vip | premium",
//       });
//     }

//     if (is_available !== undefined && typeof is_available !== "boolean") {
//       return res.status(400).json({
//         success: false,
//         message: "is_available must be boolean",
//       });
//     }

//     if (price !== undefined && isNaN(price)) {
//       return res.status(400).json({
//         success: false,
//         message: "price must be a number",
//       });
//     }

//     // =========================
//     // CHECK DUPLICATE SEAT
//     // =========================
//     const existingSeat = await HallSeat.findOne({
//       where: {
//         row_id,
//         seat_number,
//       },
//     });

//     if (existingSeat) {
//       return res.status(409).json({
//         success: false,
//         message: "Seat already exists in this row",
//       });
//     }

//     // =========================
//     // CREATE SEAT
//     // =========================
//     const seat = await HallSeat.create({
//       row_id,
//       seat_number: String(seat_number).trim(),
//       seat_type: seat_type || "standard",
//       is_available: is_available !== undefined ? is_available : true,
//       price: price || 0,
//       status: status || "active",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Hall seat created successfully",
//       data: seat,
//     });
//   } catch (error) {
//     console.error("Seat Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create hall seat",
//     });
//   }
// };

// /* UPDATE */
// exports.updateHallSeat = async (req, res) => {
//   try {
//     const seat = await HallSeat.findByPk(req.params.id);

//     if (!seat) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall seat not found",
//       });
//     }

//     await seat.update(req.body);

//     return res.json({
//       success: true,
//       message: "Hall seat updated successfully",
//       data: seat,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update hall seat",
//     });
//   }
// };

// /* DELETE */
// exports.deleteHallSeat = async (req, res) => {
//   try {
//     const seat = await HallSeat.findByPk(req.params.id);

//     if (!seat) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall seat not found",
//       });
//     }

//     await seat.destroy();

//     return res.json({
//       success: true,
//       message: "Hall seat deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete hall seat",
//     });
//   }
// };

// controllers/seat/seatController.js
const { Seat, Hall } = require("../../models");
const { sequelize } = require("../../config/db");

// GET /api/seats?hall_id=X
exports.getSeats = async (req, res) => {
  try {
    const { hall_id, row_label, seat_type } = req.query;
    if (!hall_id)
      return res
        .status(400)
        .json({ success: false, message: "hall_id required" });

    const where = { hall_id, is_active: true };
    if (row_label) where.row_label = row_label;
    if (seat_type) where.seat_type = seat_type;

    const seats = await Seat.findAll({
      where,
      order: [
        ["row_label", "ASC"],
        ["col_index", "ASC"],
      ],
    });

    return res.json({ success: true, data: seats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/seats/:id
exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);
    if (!seat)
      return res
        .status(404)
        .json({ success: false, message: "Seat not found" });
    return res.json({ success: true, data: seat });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/seats  — single seat
exports.createSeat = async (req, res) => {
  try {
    const {
      hall_id,
      seat_name,
      row_label = "",
      col_index,
      seat_type = "standard",
      is_space = false,
      section_label,
      price = 0,
      x_pos = 0,
      y_pos = 0,
      fill = "#b2b2b2",
      sort_order = 0,
    } = req.body;

    if (!hall_id)
      return res
        .status(400)
        .json({ success: false, message: "hall_id required" });
    if (!seat_name)
      return res
        .status(400)
        .json({ success: false, message: "seat_name required" });

    const hall = await Hall.findByPk(hall_id);
    if (!hall)
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });

    // Check duplicate
    const exists = await Seat.findOne({ where: { hall_id, seat_name } });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Seat already exists in this hall" });

    const seat = await Seat.create({
      hall_id,
      seat_name,
      row_label,
      col_index: col_index || 0,
      seat_type,
      is_space,
      section_label,
      price,
      x_pos,
      y_pos,
      fill,
      sort_order,
    });

    return res
      .status(201)
      .json({ success: true, message: "Seat created", data: seat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/seats/bulk  — batch create (Draw Mode save)
exports.bulkCreateSeats = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { hall_id, seats = [] } = req.body;
    if (!hall_id)
      return res
        .status(400)
        .json({ success: false, message: "hall_id required" });
    if (!seats.length)
      return res
        .status(400)
        .json({ success: false, message: "seats array required" });

    const hall = await Hall.findByPk(hall_id);
    if (!hall)
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });

    const records = seats.map((s, i) => ({
      hall_id,
      seat_name: s.seat_name,
      row_label: s.row_label || "",
      col_index: s.col_index || i + 1,
      seat_type: s.seat_type || "standard",
      is_space: s.is_space || false,
      section_label: s.section_label || null,
      price: s.price || 0,
      x_pos: s.x_pos || 0,
      y_pos: s.y_pos || 0,
      fill: s.fill || "#b2b2b2",
      sort_order: s.sort_order || i,
      is_active: true,
    }));

    const created = await Seat.bulkCreate(records, {
      transaction: t,
      ignoreDuplicates: true,
    });

    // Update hall grid dimensions
    const rowLabels = [
      ...new Set(records.filter((r) => r.row_label).map((r) => r.row_label)),
    ];
    const maxCol = records.reduce((m, r) => Math.max(m, r.col_index), 0);
    await hall.update(
      { total_rows: rowLabels.length, total_cols: maxCol },
      { transaction: t },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: `${created.length} seats created`,
      data: { count: created.length },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/seats/:id
exports.updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);
    if (!seat)
      return res
        .status(404)
        .json({ success: false, message: "Seat not found" });
    await seat.update(req.body);
    return res.json({ success: true, message: "Seat updated", data: seat });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/seats/:id
exports.deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);
    if (!seat)
      return res
        .status(404)
        .json({ success: false, message: "Seat not found" });
    await seat.destroy();
    return res.json({ success: true, message: "Seat deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/seats/hall/:hall_id  — clear all seats for a hall (redraw)
exports.clearHallSeats = async (req, res) => {
  try {
    const count = await Seat.destroy({
      where: { hall_id: req.params.hall_id },
    });
    return res.json({ success: true, message: `${count} seats cleared` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
