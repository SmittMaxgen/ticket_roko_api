// /*
// models/HallSeat.js
// Based exactly on your SQL schema
// */

// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../config/db");

// const HallSeat = sequelize.define(
//   "HallSeat",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     row_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },

//     seat_number: {
//       type: DataTypes.STRING(10),
//       allowNull: false,
//     },

//     seat_type: {
//       type: DataTypes.ENUM("standard", "vip", "wheelchair", "reserved"),
//       defaultValue: "standard",
//     },

//     pos_x: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//     },

//     pos_y: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//     },

//     is_active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//   },
//   {
//     tableName: "hall_seats",
//     timestamps: false,
//   },
// );

// module.exports = HallSeat;

// models/seat/SeatModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Seat = sequelize.define(
  "Seat",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hall_id: { type: DataTypes.INTEGER, allowNull: false },

    // ── Grid identity ─────────────────────────────────────
    // seat_name  = display name: "A1", "A-SPC-1", "AISLE-1"
    // row_label  = "A", "B", "C" — empty string for full-row aisles
    // col_index  = 1-based column number in the grid
    seat_name: { type: DataTypes.STRING(20), allowNull: false },
    row_label: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "",
    },
    col_index: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    // ── Type & booking eligibility ───────────────────────
    // seat_type = "space" means aisle/gap — frontend renders it as a non-clickable gap
    seat_type: {
      type: DataTypes.ENUM("standard", "vip", "wheelchair", "space"),
      defaultValue: "standard",
    },
    is_space: { type: DataTypes.BOOLEAN, defaultValue: false }, // true = aisle/gap, not bookable

    // ── Logical grouping (replaces old sections table) ────
    // section_label = "Left Block", "Centre", "Right Block", "Balcony", etc.
    // This is purely a label — no separate section table needed
    section_label: { type: DataTypes.STRING(50), allowNull: true },

    // ── Pricing ──────────────────────────────────────────
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },

    // ── Canvas position (centre of seat on SVG) ──────────
    x_pos: { type: DataTypes.FLOAT, defaultValue: 0 },
    y_pos: { type: DataTypes.FLOAT, defaultValue: 0 },

    // ── Visual ───────────────────────────────────────────
    fill: { type: DataTypes.STRING(10), defaultValue: "#b2b2b2" },

    // ── Ordering ─────────────────────────────────────────
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },

    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "seats",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["hall_id", "seat_name"] }, // each seat name unique per hall
      { fields: ["hall_id", "row_label"] }, // fast row queries
    ],
  },
);

module.exports = Seat;
