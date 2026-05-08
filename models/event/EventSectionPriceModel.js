const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const EventSectionPrice = sequelize.define(
  "EventSectionPrice",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    section_label: { type: DataTypes.STRING(50), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  },
  {
    tableName: "event_section_prices",
    timestamps: false,
    indexes: [{ unique: true, fields: ["event_id", "section_label"] }],
  },
);

module.exports = EventSectionPrice;
