// models/partyPlot/PartyPlotTicketModel.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const PartyPlotTicket = sequelize.define(
  "PartyPlotTicket",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    party_plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "party_plots",
        key: "id",
      },
    },
    ticket_number: {
      type: DataTypes.STRING(50),
      allowNull: false, // e.g., PP001-001
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("available", "booked", "used", "cancelled"),
      defaultValue: "available",
    },
    booked_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    party_plot_booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "party_plot_bookings",
        key: "id",
      },
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "party_plot_tickets",
    timestamps: true,
  },
);

module.exports = PartyPlotTicket;
