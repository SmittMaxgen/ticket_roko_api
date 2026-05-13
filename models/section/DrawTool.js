const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const DrawTool = sequelize.define(
  "DrawTool",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tool_key: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    icon: { type: DataTypes.STRING(10), allowNull: false },
    label: { type: DataTypes.STRING(100), allowNull: false },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: "draw_tools", timestamps: false },
);

module.exports = DrawTool;
