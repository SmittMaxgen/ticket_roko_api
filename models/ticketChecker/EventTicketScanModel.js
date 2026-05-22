const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const EventTicketScan = sequelize.define(
  "EventTicketScan",
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
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scanned_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    scanned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "event_ticket_scans",
    timestamps: false,
  },
);

module.exports = EventTicketScan;
