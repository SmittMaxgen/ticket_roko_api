const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const EventTicketAssignment = sequelize.define(
  "EventTicketAssignment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
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
    tableName: "event_ticket_assignments",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["event_id", "user_id"],
      },
    ],
  },
);

module.exports = EventTicketAssignment;
