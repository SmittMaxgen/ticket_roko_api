/*
models/Banner.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    link_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    position: {
      type: DataTypes.ENUM("home_top", "home_middle", "sidebar"),
      defaultValue: "home_top",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "banners",
    timestamps: false,
  },
);

module.exports = Banner;
