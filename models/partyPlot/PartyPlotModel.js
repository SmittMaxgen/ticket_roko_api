// models/partyPlot/PartyPlotModel.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const PartyPlot = sequelize.define(
  "PartyPlot",
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
    image: {
      type: DataTypes.STRING(255),
      allowNull: true, // URL or path to image
    },
    total_tickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available_tickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    tableName: "party_plots",
    timestamps: true,
  },
);

module.exports = PartyPlot;
