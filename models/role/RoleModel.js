/*
models/Role.js
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    is_access_to_vendor_organizer_dashboard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_access_to_admin_dashboard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_access_to_artist_dashboard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_access_to_website: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Role;
