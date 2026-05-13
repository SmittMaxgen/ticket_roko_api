const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const SeatShape = sequelize.define(
  "SeatShape",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
    border_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
  },
  { tableName: "seat_shapes", timestamps: false },
);

module.exports = SeatShape;
