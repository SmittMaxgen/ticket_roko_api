/*
models/BookingSeat.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const BookingSeat = sequelize.define(
  "BookingSeat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    status: {
      type: DataTypes.ENUM("booked", "cancelled"),
      defaultValue: "booked",
    },
  },
  {
    tableName: "booking_seats",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["seat_id", "event_id"],
        name: "unique_seat_event",
      },
    ],
  },
);

module.exports = BookingSeat;
