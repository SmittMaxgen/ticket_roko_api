/*
models/Booking.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    booking_ref: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    convenience_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    payment_ref: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },

    booked_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bookings",
    timestamps: false,
  },
);

module.exports = Booking;
