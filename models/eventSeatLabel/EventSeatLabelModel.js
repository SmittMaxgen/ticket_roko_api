const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const EventSeatLabel = sequelize.define(
  "EventSeatLabel",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    seat_id: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "event_seat_labels",
    timestamps: false,
    indexes: [{ unique: true, fields: ["event_id", "seat_id"] }],
  },
);

module.exports = EventSeatLabel;
