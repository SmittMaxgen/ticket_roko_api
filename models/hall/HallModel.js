// /*
// models/Hall.js
// Based exactly on your SQL schema
// */

// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../config/db");

// const Hall = sequelize.define(
//   "Hall",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     name: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },

//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },

//     hall_type: {
//       type: DataTypes.ENUM(
//         "end_stage",
//         "arena",
//         "proscenium",
//         "traverse",
//         "custom",
//       ),
//       defaultValue: "custom",
//     },

//     total_capacity: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },

//     address: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },

//     city: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },

//     is_active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },

//     created_by: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     tableName: "halls",
//     timestamps: false,
//   },
// );

// module.exports = Hall;

// models/hall/HallModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Hall = sequelize.define(
  "Hall",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    hall_type: {
      type: DataTypes.ENUM(
        "end_stage",
        "arena",
        "proscenium",
        "traverse",
        "custom",
      ),
      defaultValue: "custom",
    },
    address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    // Grid size — used by frontend to know total grid extent
    total_rows: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    total_cols: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    // SVG viewport — frontend renders at this exact scale
    canvas_width: {
      type: DataTypes.FLOAT,
      defaultValue: 800,
      allowNull: false,
    },
    canvas_height: {
      type: DataTypes.FLOAT,
      defaultValue: 600,
      allowNull: false,
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "halls", timestamps: false },
);

module.exports = Hall;
