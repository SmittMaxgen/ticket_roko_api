/*
models/Hall.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Hall = sequelize.define(
  "Hall",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    hall_type: {
      type: DataTypes.ENUM(
        "end_stage",
        "arena",
        "proscenium",
        "traverse",
        "custom",
      ),
      defaultValue: "custom",
    },

    total_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "halls",
    timestamps: false,
  },
);

module.exports = Hall;
