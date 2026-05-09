const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    vendor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vendor_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    vendor_identity_type: {
      type: DataTypes.ENUM("aadhaar_card", "pan_card"),
      allowNull: false,
    },

    vendor_identity_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    alternate_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    alternate_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    event_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    organizing_committee: {
      type: DataTypes.ENUM("educational_institute", "others"),
      allowNull: false,
    },

    event_type: {
      type: DataTypes.ENUM(
        "talk_show",
        "annual_function",
        "seminar",
        "event_hosting",
        "get_together",
        "music_show",
        "movie_show",
        "live_show",
        "others",
      ),
      allowNull: false,
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
      allowNull: false,
    },

    event_pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expected_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    venue_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    food_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    ticketroko_services_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sponsorship_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    services_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "vendors",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Vendor;
