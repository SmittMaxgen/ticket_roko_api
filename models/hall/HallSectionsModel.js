/*
models/HallSection.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const HallSection = sequelize.define(
  "HallSection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    hall_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING(10),
      defaultValue: "#6366f1",
    },

    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "hall_sections",
    timestamps: false,
  },
);

module.exports = HallSection;
