/*
models/User.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const User = sequelize.define(
  "User",
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

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("super_admin", "admin", "organizer", "user"),
      defaultValue: "user",
    },

    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    kyc_status: {
      type: DataTypes.ENUM("pending", "submitted", "approved", "rejected"),
      defaultValue: "pending",
    },

    kyc_doc_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = User;
