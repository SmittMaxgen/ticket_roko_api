/*
models/HallRow.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const HallRow = sequelize.define(
  "HallRow",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    row_label: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "hall_rows",
    timestamps: false,
  },
);

module.exports = HallRow;
