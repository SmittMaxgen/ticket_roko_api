/*
models/Wishlist.js
Based exactly on your SQL schema
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wishlists",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "event_id"],
        name: "unique_wishlist",
      },
    ],
  },
);

module.exports = Wishlist;
