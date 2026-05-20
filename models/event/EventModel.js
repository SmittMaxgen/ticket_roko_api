/*
models/Event.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    hall_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    banner_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    ticket_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    total_tickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    sold_tickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_free: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_trending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "English",
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "pending_approval",
        "approved",
        "rejected",
        "cancelled",
        "completed",
      ),
      defaultValue: "draft",
    },

    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    published_at: {
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
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Event;
