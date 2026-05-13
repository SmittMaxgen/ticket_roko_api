// // controllers/adminHallController.js

// const { sequelize } = require("../../config/db");
// const Hall = require("../../models/hall/HallModel");
// const User = require("../../models/user/UserModel");
// const HallSection = require("../../models/hall/HallSectionsModel");
// const HallRow = require("../../models/hall/HallRowModel");
// const HallSeat = require("../../models/hall/HallSeatModel");

// // GET /api/halls
// exports.getAllHalls = async (req, res) => {
//   try {
//     const halls = await Hall.findAll({
//       where: { is_active: 1 },
//       include: [
//         {
//           model: User,
//           as: "creator",
//           attributes: ["id", "name"],
//         },
//         {
//           model: HallSection,
//           as: "sections",
//           attributes: ["id"],
//         },
//       ],
//       order: [["created_at", "DESC"]],
//     });

//     const data = halls.map((hall) => ({
//       ...hall.toJSON(),
//       sections_count: hall.sections ? hall.sections.length : 0,
//     }));

//     return res.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // GET /api/halls/:id
// exports.getHallById = async (req, res) => {
//   try {
//     const hall = await Hall.findByPk(req.params.id, {
//       include: [
//         {
//           model: HallSection,
//           as: "sections",
//           include: [
//             {
//               model: HallRow,
//               as: "rows",
//               include: [
//                 {
//                   model: HallSeat,
//                   as: "HallSeats",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!hall) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: hall,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // POST /api/halls
// exports.createHall = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       name,
//       description,
//       hall_type,
//       address,
//       city,
//       sections = [],
//     } = req.body;

//     if (!name || !hall_type || !address || !city) {
//       return res.status(400).json({
//         success: false,
//         message: "name, hall_type, address, and city are required",
//       });
//     }

//     const totalCapacity = sections.reduce((sum, section) => {
//       return (
//         sum +
//         section.rows.reduce((rowSum, row) => {
//           return rowSum + Number(row.total_seats || 0);
//         }, 0)
//       );
//     }, 0);

//     const hall = await Hall.create(
//       {
//         name,
//         description,
//         hall_type,
//         total_capacity: totalCapacity,
//         address,
//         city,
//         created_by: req.user.id,
//       },
//       { transaction },
//     );

//     for (let si = 0; si < sections.length; si++) {
//       const sec = sections[si];

//       const section = await HallSection.create(
//         {
//           hall_id: hall.id,
//           name: sec.name,
//           color: sec.color,
//           sort_order: si,
//         },
//         { transaction },
//       );

//       for (let ri = 0; ri < sec.rows.length; ri++) {
//         const row = sec.rows[ri];

//         const createdRow = await HallRow.create(
//           {
//             section_id: section.id,
//             row_label: row.row_label,
//             total_seats: row.total_seats,
//             sort_order: ri,
//           },
//           { transaction },
//         );

//         const seats = [];

//         for (let sn = 1; sn <= row.total_seats; sn++) {
//           seats.push({
//             row_id: createdRow.id,
//             seat_number: String(sn),
//             seat_type: row.seat_type || "standard",
//           });
//         }

//         if (seats.length) {
//           await HallSeat.bulkCreate(seats, { transaction });
//         }
//       }
//     }

//     await transaction.commit();

//     return res.status(201).json({
//       success: true,
//       data: { id: hall.id },
//       message: "Hall created",
//     });
//   } catch (error) {
//     await transaction.rollback();

//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // PUT /api/halls/:id
// exports.updateHall = async (req, res) => {
//   try {
//     const hall = await Hall.findByPk(req.params.id);

//     if (!hall) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall not found",
//       });
//     }

//     const { name, description, hall_type, address, city, is_active } = req.body;

//     await hall.update({
//       name,
//       description,
//       hall_type,
//       address,
//       city,
//       is_active,
//     });

//     return res.json({
//       success: true,
//       message: "Hall updated",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // DELETE /api/halls/:id
// exports.deleteHall = async (req, res) => {
//   try {
//     const hall = await Hall.findByPk(req.params.id);

//     if (!hall) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall not found",
//       });
//     }

//     await hall.update({
//       is_active: 0,
//     });

//     return res.json({
//       success: true,
//       message: "Hall deactivated",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// controllers/hall/hallController.js
const { sequelize } = require("../../config/db");
const { Hall, Seat, User } = require("../../models");
const { Op } = require("sequelize");

// ── helpers ───────────────────────────────────────────────
const formatSeatId = (id) => `AC${String(id).padStart(8, "0")}`;

// Inject booking status into seats for a specific event
const injectSeatStatus = async (seats, eventId) => {
  if (!eventId)
    return seats.map((s) => ({ ...s.toJSON(), status: "available" }));

  const { BookingSeat } = require("../../models");
  const booked = await BookingSeat.findAll({
    where: { event_id: eventId, status: "booked" },
    attributes: ["seat_id"],
    raw: true,
  });
  const bookedIds = new Set(booked.map((b) => b.seat_id));

  return seats.map((s) => ({
    ...s.toJSON(),
    formatted_id: formatSeatId(s.id),
    status: s.is_space ? "space" : bookedIds.has(s.id) ? "sold" : "available",
  }));
};

// ── GET ALL ───────────────────────────────────────────────
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.findAll({
      where: { is_active: true },
      include: [{ model: User, as: "creator", attributes: ["id", "name"] }],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("seats.id")), "seat_count"],
        ],
      },
      include: [
        { model: User, as: "creator", attributes: ["id", "name"] },
        {
          model: Seat,
          as: "seats",
          attributes: ["id"],
          where: { is_active: true, is_space: false },
          required: false,
        },
      ],
      group: ["Hall.id", "creator.id"],
      order: [["created_at", "DESC"]],
      subQuery: false,
    });

    const data = halls.map((h) => {
      const j = h.toJSON();
      return {
        ...j,
        total_bookable_seats: j.seats ? j.seats.length : 0,
        seats: undefined,
      };
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    // Fallback: simple query without subquery
    try {
      const halls = await Hall.findAll({
        where: { is_active: true },
        order: [["created_at", "DESC"]],
      });
      return res.json({ success: true, data: halls });
    } catch (err2) {
      return res.status(500).json({ success: false, message: err2.message });
    }
  }
};

// ── GET BY ID ─────────────────────────────────────────────
// Returns hall + flat seats array.
// Pass ?event_id=X to get availability status per seat.
exports.getHallById = async (req, res) => {
  try {
    const { event_id } = req.query;

    const hall = await Hall.findByPk(req.params.id, {
      include: [
        {
          model: Seat,
          as: "seats",
          where: { is_active: true },
          required: false,
          order: [
            ["row_label", "ASC"],
            ["col_index", "ASC"],
          ],
        },
      ],
    });

    if (!hall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    // Inject availability status if event_id provided
    const seats = await injectSeatStatus(
      hall.seats || [],
      event_id ? +event_id : null,
    );

    // Group seats by row_label for convenience
    const rows = {};
    seats.forEach((seat) => {
      const key = seat.row_label || "__AISLE__";
      if (!rows[key]) rows[key] = [];
      rows[key].push(seat);
    });

    return res.json({
      success: true,
      data: {
        ...hall.toJSON(),
        seats, // flat array — frontend groups by row_label
        rows, // grouped by row for direct use
        seats: undefined,
      },
      // Rebuild without seats key conflict
      ...{ data: { ...hall.toJSON(), seats, rows } },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── CREATE (Hall + Seats in one transaction) ───────────────
// Body:
// {
//   name, description, hall_type, address, city,
//   canvas_width, canvas_height,
//   seats: [
//     { seat_name:"A1", row_label:"A", col_index:1, seat_type:"vip",
//       is_space:false, section_label:"Left", price:800, x_pos:120, y_pos:80, fill:"#f59e0b" },
//     { seat_name:"A-SPC-1", row_label:"A", col_index:2, seat_type:"space", is_space:true },
//     ...
//   ]
// }
exports.createHall = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      description,
      hall_type,
      address,
      city,
      canvas_width = 800,
      canvas_height = 600,
      seats = [],
    } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "name is required" });
    if (!hall_type)
      return res
        .status(400)
        .json({ success: false, message: "hall_type is required" });

    // Compute grid dimensions from seats
    const rowLabels = [
      ...new Set(seats.filter((s) => s.row_label).map((s) => s.row_label)),
    ];
    const maxCol = seats.reduce((m, s) => Math.max(m, s.col_index || 0), 0);
    const bookable = seats.filter((s) => !s.is_space).length;

    const hall = await Hall.create(
      {
        name,
        description,
        hall_type,
        address,
        city,
        canvas_width,
        canvas_height,
        total_rows: rowLabels.length,
        total_cols: maxCol,
        created_by: req.user.id,
      },
      { transaction: t },
    );

    // Bulk create all seats
    if (seats.length > 0) {
      const seatRecords = seats.map((s, i) => ({
        hall_id: hall.id,
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

      await Seat.bulkCreate(seatRecords, {
        transaction: t,
        ignoreDuplicates: true,
      });
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: `Hall created with ${seats.length} seats (${bookable} bookable)`,
      data: { id: hall.id },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

// ── UPDATE (basic info) ───────────────────────────────────
exports.updateHall = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const hall = await Hall.findByPk(req.params.id);

    if (!hall) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    const {
      name,
      description,
      hall_type,
      address,
      city,
      is_active,
      canvas_width,
      canvas_height,
      seats = [],
    } = req.body;

    // ── 1. Update hall metadata ─────────────────────────
    await hall.update(
      {
        name,
        description,
        hall_type,
        address,
        city,
        is_active,
        canvas_width,
        canvas_height,
        total_rows: [
          ...new Set(seats.filter((s) => !s.is_space).map((s) => s.row_label)),
        ].length,
        total_cols:
          seats.length > 0
            ? Math.max(...seats.map((s) => s.col_index || 0))
            : 0,
      },
      { transaction: t },
    );

    // ── 2. Delete all existing seats for this hall ──────
    await Seat.destroy({
      where: { hall_id: hall.id },
      transaction: t,
    });

    // ── 3. Bulk insert new seats ────────────────────────
    if (seats.length > 0) {
      await Seat.bulkCreate(
        seats.map((seat) => ({
          hall_id: hall.id,
          seat_name: seat.seat_name,
          row_label: seat.row_label || "",
          col_index: seat.col_index || 0,
          seat_type: seat.seat_type || "standard",
          is_space: seat.is_space || false,
          section_label: seat.section_label || null,
          price: seat.price || 0,
          x_pos: seat.x_pos || 0,
          y_pos: seat.y_pos || 0,
          fill: seat.fill || "#b2b2b2",
          sort_order: seat.sort_order || 0,
          is_active: true,
        })),
        { transaction: t },
      );
    }

    await t.commit();

    return res.json({
      success: true,
      message: "Hall updated successfully",
      data: { id: hall.id, total_seats: seats.length },
    });
  } catch (err) {
    await t.rollback();
    console.error("updateHall error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

// ── DELETE ────────────────────────────────────────────────
exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall)
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });

    await hall.update({ is_active: false });
    return res.json({ success: true, message: "Hall deactivated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET STATS ─────────────────────────────────────────────
exports.getHallStats = async (req, res) => {
  try {
    const [[stats]] = await sequelize.query(`
      SELECT
        COUNT(DISTINCT h.id)                             AS total_halls,
        SUM(h.total_rows * h.total_cols)                 AS total_grid_cells,
        COUNT(s.id)                                      AS total_seats,
        SUM(CASE WHEN s.is_space = 0 THEN 1 ELSE 0 END) AS bookable_seats,
        SUM(CASE WHEN s.seat_type = 'vip' THEN 1 ELSE 0 END) AS vip_seats
      FROM halls h
      LEFT JOIN seats s ON s.hall_id = h.id AND s.is_active = 1
      WHERE h.is_active = 1
    `);
    return res.json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// hallController.js — ADD this function
exports.updateSeatLabels = async (req, res) => {
  const { seat_ids, section_label } = req.body;
  const { hallId } = req.params;

  try {
    const { Seat } = require("../../models");

    await Seat.update(
      { section_label },
      { where: { id: seat_ids, hall_id: hallId } },
    );

    // Return updated seats so FE can reflect immediately
    const updatedSeats = await Seat.findAll({
      where: { id: seat_ids, hall_id: hallId },
      attributes: [
        "id",
        "seat_name",
        "row_label",
        "section_label",
        "fill",
        "price",
      ],
    });

    return res.json({
      success: true,
      section_label,
      updated_count: updatedSeats.length,
      seats: updatedSeats.map((s) => s.toJSON()),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
