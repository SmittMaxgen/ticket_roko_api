const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const PartyPlotBooking = sequelize.define(
  "PartyPlotBooking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    party_plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_ref: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    total_tickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    status: {
      type: DataTypes.ENUM("confirmed", "cancelled", "pending"),
      defaultValue: "confirmed",
    },
  },
  {
    tableName: "party_plot_bookings",
    timestamps: true,
    underscored: true,
  },
);

module.exports = PartyPlotBooking;
