const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const PartyPlotTicketAssignment = sequelize.define(
  "PartyPlotTicketAssignment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    party_plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "party_plot_ticket_assignments",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["party_plot_id", "user_id"],
      },
    ],
  },
);

module.exports = PartyPlotTicketAssignment;
