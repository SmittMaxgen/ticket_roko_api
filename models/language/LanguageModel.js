const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
      comment: "ISO 639-1 code e.g. en, hi, gu",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "languages",
    timestamps: false,
  },
);

module.exports = Language;
