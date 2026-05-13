const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Section = sequelize.define(
  "Section",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_key: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    label: { type: DataTypes.STRING(100), allowNull: false },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "#818cf8",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    seat_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "standard",
    },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: "sections", timestamps: false },
);

module.exports = Section;
