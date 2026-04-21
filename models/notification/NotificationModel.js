/*
models/Notification.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    target: {
      type: DataTypes.ENUM("all", "users", "organizers", "specific"),
      defaultValue: "all",
    },

    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notifications",
    timestamps: false,
  },
);

module.exports = Notification;
