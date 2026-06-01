/*
  models/Advertisement.js
  Covers every field needed for ad banners / promotional cards:
  image, title, tagline, target URL, placement, scheduling,
  display colour, ordering, and visibility.
*/

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Advertisement = sequelize.define(
  "Advertisement",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ── Core identity ────────────────────────────────────────────────
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'Display title of the advertisement, e.g. "Summer Sale 50% Off"',
    },

    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly identifier, e.g. "summer-sale-50-off"',
    },

    // ── Visual / media ───────────────────────────────────────────────
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Full banner / hero image URL for the advertisement",
    },

    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Smaller preview image used in lists or mobile views",
    },

    bg_color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "#1DB954",
      comment:
        'Background colour hex for text-only or overlay ads, e.g. "#FF5733"',
    },

    // ── Text content ─────────────────────────────────────────────────
    tagline: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment:
        'Sub-heading / short description, e.g. "Limited seats. Book before they\'re gone!"',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Longer rich-text body shown in expanded / detail view",
    },

    // ── Badge / offer strip ──────────────────────────────────────────
    badge_text: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Small pill label, e.g. "HOT DEAL" or "SPONSOR"',
    },

    discount_text: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Discount line, e.g. "Flat 20% off on all bookings"',
    },

    terms_text: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Fine-print / T&C line, e.g. "*Valid till 31 Dec. T&C apply."',
    },

    // ── Category tags ────────────────────────────────────────────────
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of tag strings, e.g. ["OFFER","FEATURED","NEW"]',
    },

    // ── Placement ────────────────────────────────────────────────────
    placement: {
      type: DataTypes.ENUM(
        "home_top",
        "home_mid",
        "home_bottom",
        "sidebar",
        "popup",
        "other",
      ),
      allowNull: true,
      defaultValue: "home_top",
      comment: "Where on the page / app this ad should be rendered",
    },

    // ── Scheduling ───────────────────────────────────────────────────
    starts_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date-time from which the ad becomes visible (null = immediate)",
    },

    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date-time after which the ad is hidden (null = no expiry)",
    },

    // ── CTA / booking link ───────────────────────────────────────────
    url_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Deep-link or external URL wired to the CTA button",
    },

    cta_text: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "Learn More",
      comment: 'Call-to-action button label, e.g. "Shop Now" or "Book Tickets"',
    },

    // ── Analytics ────────────────────────────────────────────────────
    click_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Running total of CTA clicks for basic analytics",
    },

    impression_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Running total of times this ad was rendered",
    },

    // ── Ordering & visibility ────────────────────────────────────────
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Lower value = shown first within the same placement slot",
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Pin this ad to the top of its placement slot",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // ── Ownership ────────────────────────────────────────────────────
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      comment: "Admin / advertiser who created this advertisement",
    },
  },
  {
    tableName: "advertisements",
    timestamps: true,
    createdAt: "created_at",
  updatedAt: "updated_at",

  },
);

module.exports = Advertisement;
