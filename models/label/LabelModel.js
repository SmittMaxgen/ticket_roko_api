/*
  models/Label.js
  Covers every field visible on the event-booking accordion banner:
  image, title, tagline, tags, age-rating, offer badge,
  discount, T&C, booking URL, and display colour.
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Label = sequelize.define(
  "Label",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ── Core identity ────────────────────────────────────────────────
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'Display title shown on the banner, e.g. "COMEDY NIGHT"',
    },

    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly identifier, e.g. "comedy-night"',
    },

    // ── Visual / media ───────────────────────────────────────────────
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment:
        "Full banner / hero image URL shown on the right side of the card",
    },

    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Smaller preview image used in lists or accordion headers",
    },

    bg_color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "#1DB954",
      comment: 'Left-panel background colour hex, e.g. "#1DB954" (green)',
    },

    // ── Text content ─────────────────────────────────────────────────
    tagline: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment:
        'Sub-heading shown below the offer badge, e.g. "Laughter Therapy. Stand-up Special."',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Longer rich-text description shown inside the accordion body",
    },

    // ── Badge / offer strip ──────────────────────────────────────────
    badge_text: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Small top-left pill label, e.g. "LIMITED TIME OFFER"',
    },

    discount_text: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment:
        'Discount line shown under tagline, e.g. "Group Discount of 10%*"',
    },

    terms_text: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Fine-print below Book Now button, e.g. "*T&C APPLY*"',
    },

    // ── Category tags (COMEDY · SOLO · LIVE) ─────────────────────────
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment:
        'Array of tag strings shown as pills, e.g. ["COMEDY","SOLO","LIVE"]',
    },

    // ── Age / content rating ─────────────────────────────────────────
    age_rating: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Audience age badge, e.g. "15+" or "U/A"',
    },

    // ── Booking link ─────────────────────────────────────────────────
    url_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment:
        "Deep-link or external URL wired to the Book Now / Book Tickets button",
    },

    cta_text: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "Book Now",
      comment: 'Call-to-action button label, e.g. "Book Now" or "Book Tickets"',
    },

    // ── Ordering & visibility ────────────────────────────────────────
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Lower value = shown first in the accordion",
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Pin this label to the top of the accordion / slider",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // ── Ownership (mirrors User FK pattern) ──────────────────────────
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      comment: "Admin / organiser who created this label",
    },

    // ── Timestamps ───────────────────────────────────────────────────
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
    tableName: "labels",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Label;
