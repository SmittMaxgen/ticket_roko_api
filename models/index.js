// /*
// models/index.js
// All Sequelize model imports + associations
// Based exactly on your SQL schema
// */

// const sequelize = require("../config/db");

// const User = require("./user/UserModel");
// const Category = require("./category/CategoryModel");
// const Hall = require("./hall/HallModel");
// const HallSection = require("./hall/HallSectionsModel");
// const HallRow = require("./hall/HallRowModel");
// const HallSeat = require("./hall/HallSeatModel");
// const Event = require("./event/EventModel");
// const Booking = require("./booking/BookingModel");
// const BookingSeat = require("./booking/BookingSeatModel");
// const Banner = require("./banner/BannerModel");
// const Notification = require("./notification/NotificationModel");
// const Wishlist = require("./whishlist/WhishListModel");
// const RefreshToken = require("./refreshToken/RefreshTokenModel");
// const Role = require("./role/RoleModel");

// /* ===============================
//    USER RELATIONS
// =============================== */

// User.hasMany(Hall, {
//   foreignKey: "created_by",
//   as: "createdHalls",
// });

// Hall.belongsTo(User, {
//   foreignKey: "created_by",
//   as: "creator",
// });

// User.hasMany(Event, {
//   foreignKey: "organizer_id",
//   as: "organizedEvents",
// });

// Event.belongsTo(User, {
//   foreignKey: "organizer_id",
//   as: "organizer",
// });

// User.hasMany(Booking, {
//   foreignKey: "user_id",
// });

// Booking.belongsTo(User, {
//   foreignKey: "user_id",
// });

// User.hasMany(RefreshToken, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });

// RefreshToken.belongsTo(User, {
//   foreignKey: "user_id",
// });

// /* ===============================
//    CATEGORY RELATIONS
// =============================== */

// Category.hasMany(Event, { foreignKey: "category_id" });
// Event.belongsTo(Category, { foreignKey: "category_id" });
// /* ===============================
//    HALL RELATIONS
// =============================== */

// Hall.hasMany(Event, {
//   foreignKey: "hall_id",
// });

// Event.belongsTo(Hall, {
//   foreignKey: "hall_id",
// });

// Hall.hasMany(HallSection, {
//   foreignKey: "hall_id",
//   as: "sections",
//   onDelete: "CASCADE",
// });

// HallSection.belongsTo(Hall, {
//   foreignKey: "hall_id",
//   as: "hall",
// });

// HallSection.hasMany(HallRow, {
//   as: "rows",
//   foreignKey: "section_id",
//   onDelete: "CASCADE",
// });

// HallRow.belongsTo(HallSection, {
//   as: "section",
//   foreignKey: "section_id",
// });

// HallRow.hasMany(HallSeat, {
//   foreignKey: "row_id",
//   onDelete: "CASCADE",
// });

// HallSeat.belongsTo(HallRow, {
//   foreignKey: "row_id",
// });

// /* ===============================
//    EVENT / BOOKING RELATIONS
// =============================== */

// Event.hasMany(Booking, {
//   foreignKey: "event_id",
// });

// Booking.belongsTo(Event, {
//   foreignKey: "event_id",
// });

// Booking.hasMany(BookingSeat, {
//   foreignKey: "booking_id",
// });

// BookingSeat.belongsTo(Booking, {
//   foreignKey: "booking_id",
// });

// Event.hasMany(BookingSeat, {
//   foreignKey: "event_id",
// });

// BookingSeat.belongsTo(Event, {
//   foreignKey: "event_id",
// });

// HallSeat.hasMany(BookingSeat, {
//   foreignKey: "seat_id",
// });

// BookingSeat.belongsTo(HallSeat, {
//   foreignKey: "seat_id",
// });

// /* ===============================
//    WISHLIST MANY TO MANY
// =============================== */

// User.belongsToMany(Event, {
//   through: Wishlist,
//   foreignKey: "user_id",
//   otherKey: "event_id",
//   as: "wishlistEvents",
// });

// Event.belongsToMany(User, {
//   through: Wishlist,
//   foreignKey: "event_id",
//   otherKey: "user_id",
//   as: "wishlistedUsers",
// });

// Role.hasMany(User, {
//   foreignKey: "role_id",
//   as: "users",
// });

// /* One User -> One Role */
// // User.belongsTo(Role, {
// //   foreignKey: "role_id",
// //   as: "role",
// // });

// /* ===============================
//    EXPORTS
// =============================== */

// module.exports = {
//   sequelize,
//   User,
//   Role,
//   Category,
//   Hall,
//   HallSection,
//   HallRow,
//   HallSeat,
//   Event,
//   Booking,
//   BookingSeat,
//   Banner,
//   Notification,
//   Wishlist,
//   RefreshToken,
// };

// models/index.js
const { sequelize } = require("../config/db");

const User = require("./user/UserModel");
const Category = require("./category/CategoryModel");
const Hall = require("./hall/HallModel");
const Seat = require("./hall/HallSeatModel");
const Event = require("./event/EventModel");
const Booking = require("./booking/BookingModel");
const BookingSeat = require("./booking/BookingSeatModel");
const Banner = require("./banner/BannerModel");
const Notification = require("./notification/NotificationModel");
const Wishlist = require("./whishlist/WhishListModel");
const RefreshToken = require("./refreshToken/RefreshTokenModel");
const Role = require("./role/RoleModel");
const EventSectionPrice = require("./event/EventSectionPriceModel");

// ── User ─────────────────────────────────────────────────
User.hasMany(Hall, { foreignKey: "created_by", as: "createdHalls" });
Hall.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(Event, { foreignKey: "organizer_id", as: "organizedEvents" });
Event.belongsTo(User, { foreignKey: "organizer_id", as: "organizer" });
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "user_id", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

// ── Category ─────────────────────────────────────────────
Category.hasMany(Event, { foreignKey: "category_id" });
Event.belongsTo(Category, { foreignKey: "category_id" });

// ── Hall → Seat (FLAT — no section/row tables) ───────────
Hall.hasMany(Seat, { foreignKey: "hall_id", as: "seats", onDelete: "CASCADE" });
Seat.belongsTo(Hall, { foreignKey: "hall_id", as: "hall" });

// ── Hall → Event ─────────────────────────────────────────
// Hall.hasMany(Event, { foreignKey: "hall_id" });

// Event.belongsTo(Hall, { foreignKey: "hall_id" });
Hall.hasMany(Event, {
  foreignKey: "hall_id",
  as: "events",
});
Event.belongsTo(Hall, {
  foreignKey: "hall_id",
  as: "hall",
});
// ── Event / Booking ──────────────────────────────────────
Event.hasMany(Booking, { foreignKey: "event_id" });
Booking.belongsTo(Event, { foreignKey: "event_id", as: "event" });
Booking.hasMany(BookingSeat, { foreignKey: "booking_id" });
BookingSeat.belongsTo(Booking, { foreignKey: "booking_id" });
Event.hasMany(BookingSeat, { foreignKey: "event_id" });
BookingSeat.belongsTo(Event, { foreignKey: "event_id" });
Seat.hasMany(BookingSeat, { foreignKey: "seat_id" });
BookingSeat.belongsTo(Seat, { foreignKey: "seat_id", as: "seat" });

// ── Wishlist ─────────────────────────────────────────────
User.belongsToMany(Event, {
  through: Wishlist,
  foreignKey: "user_id",
  otherKey: "event_id",
  as: "wishlistEvents",
});
Event.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "event_id",
  otherKey: "user_id",
  as: "wishlistedUsers",
});
Role.hasMany(User, { foreignKey: "role_id", as: "users" });

// ── Event Section Prices ─────────────────────────────────
Event.hasMany(EventSectionPrice, {
  foreignKey: "event_id",
  as: "sectionPrices",
  onDelete: "CASCADE",
});
EventSectionPrice.belongsTo(Event, { foreignKey: "event_id" });

module.exports = {
  sequelize,
  User,
  Role,
  Category,
  Hall,
  Seat,
  Event,
  Booking,
  BookingSeat,
  Banner,
  Notification,
  Wishlist,
  RefreshToken,
  EventSectionPrice,
};
