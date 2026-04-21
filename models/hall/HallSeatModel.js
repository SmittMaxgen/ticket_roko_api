/*
models/HallSeat.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const HallSeat = sequelize.define(
  "HallSeat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    row_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seat_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    seat_type: {
      type: DataTypes.ENUM("standard", "vip", "wheelchair", "reserved"),
      defaultValue: "standard",
    },

    pos_x: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    pos_y: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "hall_seats",
    timestamps: false,
  },
);

module.exports = HallSeat;
