// // /*
// // models/index.js
// // All Sequelize model imports + associations
// // Based exactly on your SQL schema
// // */

// // const sequelize = require("../config/db");

// // const User = require("./user/UserModel");
// // const Category = require("./category/CategoryModel");
// // const Hall = require("./hall/HallModel");
// // const HallSection = require("./hall/HallSectionsModel");
// // const HallRow = require("./hall/HallRowModel");
// // const HallSeat = require("./hall/HallSeatModel");
// // const Event = require("./event/EventModel");
// // const Booking = require("./booking/BookingModel");
// // const BookingSeat = require("./booking/BookingSeatModel");
// // const Banner = require("./banner/BannerModel");
// // const Notification = require("./notification/NotificationModel");
// // const Wishlist = require("./whishlist/WhishListModel");
// // const RefreshToken = require("./refreshToken/RefreshTokenModel");
// // const Role = require("./role/RoleModel");

// // /* ===============================
// //    USER RELATIONS
// // =============================== */

// // User.hasMany(Hall, {
// //   foreignKey: "created_by",
// //   as: "createdHalls",
// // });

// // Hall.belongsTo(User, {
// //   foreignKey: "created_by",
// //   as: "creator",
// // });

// // User.hasMany(Event, {
// //   foreignKey: "organizer_id",
// //   as: "organizedEvents",
// // });

// // Event.belongsTo(User, {
// //   foreignKey: "organizer_id",
// //   as: "organizer",
// // });

// // User.hasMany(Booking, {
// //   foreignKey: "user_id",
// // });

// // Booking.belongsTo(User, {
// //   foreignKey: "user_id",
// // });

// // User.hasMany(RefreshToken, {
// //   foreignKey: "user_id",
// //   onDelete: "CASCADE",
// // });

// // RefreshToken.belongsTo(User, {
// //   foreignKey: "user_id",
// // });

// // /* ===============================
// //    CATEGORY RELATIONS
// // =============================== */

// // Category.hasMany(Event, { foreignKey: "category_id" });
// // Event.belongsTo(Category, { foreignKey: "category_id" });
// // /* ===============================
// //    HALL RELATIONS
// // =============================== */

// // Hall.hasMany(Event, {
// //   foreignKey: "hall_id",
// // });

// // Event.belongsTo(Hall, {
// //   foreignKey: "hall_id",
// // });

// // Hall.hasMany(HallSection, {
// //   foreignKey: "hall_id",
// //   as: "sections",
// //   onDelete: "CASCADE",
// // });

// // HallSection.belongsTo(Hall, {
// //   foreignKey: "hall_id",
// //   as: "hall",
// // });

// // HallSection.hasMany(HallRow, {
// //   as: "rows",
// //   foreignKey: "section_id",
// //   onDelete: "CASCADE",
// // });

// // HallRow.belongsTo(HallSection, {
// //   as: "section",
// //   foreignKey: "section_id",
// // });

// // HallRow.hasMany(HallSeat, {
// //   foreignKey: "row_id",
// //   onDelete: "CASCADE",
// // });

// // HallSeat.belongsTo(HallRow, {
// //   foreignKey: "row_id",
// // });

// // /* ===============================
// //    EVENT / BOOKING RELATIONS
// // =============================== */

// // Event.hasMany(Booking, {
// //   foreignKey: "event_id",
// // });

// // Booking.belongsTo(Event, {
// //   foreignKey: "event_id",
// // });

// // Booking.hasMany(BookingSeat, {
// //   foreignKey: "booking_id",
// // });

// // BookingSeat.belongsTo(Booking, {
// //   foreignKey: "booking_id",
// // });

// // Event.hasMany(BookingSeat, {
// //   foreignKey: "event_id",
// // });

// // BookingSeat.belongsTo(Event, {
// //   foreignKey: "event_id",
// // });

// // HallSeat.hasMany(BookingSeat, {
// //   foreignKey: "seat_id",
// // });

// // BookingSeat.belongsTo(HallSeat, {
// //   foreignKey: "seat_id",
// // });

// // /* ===============================
// //    WISHLIST MANY TO MANY
// // =============================== */

// // User.belongsToMany(Event, {
// //   through: Wishlist,
// //   foreignKey: "user_id",
// //   otherKey: "event_id",
// //   as: "wishlistEvents",
// // });

// // Event.belongsToMany(User, {
// //   through: Wishlist,
// //   foreignKey: "event_id",
// //   otherKey: "user_id",
// //   as: "wishlistedUsers",
// // });

// // Role.hasMany(User, {
// //   foreignKey: "role_id",
// //   as: "users",
// // });

// // /* One User -> One Role */
// // // User.belongsTo(Role, {
// // //   foreignKey: "role_id",
// // //   as: "role",
// // // });

// // /* ===============================
// //    EXPORTS
// // =============================== */

// // module.exports = {
// //   sequelize,
// //   User,
// //   Role,
// //   Category,
// //   Hall,
// //   HallSection,
// //   HallRow,
// //   HallSeat,
// //   Event,
// //   Booking,
// //   BookingSeat,
// //   Banner,
// //   Notification,
// //   Wishlist,
// //   RefreshToken,
// // };

// // models/index.js
// const { sequelize } = require("../config/db");

// const User = require("./user/UserModel");
// const Category = require("./category/CategoryModel");
// const Hall = require("./hall/HallModel");
// const Seat = require("./hall/HallSeatModel");
// const Event = require("./event/EventModel");
// const Booking = require("./booking/BookingModel");
// const BookingSeat = require("./booking/BookingSeatModel");
// const Banner = require("./banner/BannerModel");
// const Notification = require("./notification/NotificationModel");
// const Wishlist = require("./whishlist/WhishListModel");
// const RefreshToken = require("./refreshToken/RefreshTokenModel");
// const Role = require("./role/RoleModel");
// const EventSectionPrice = require("./event/EventSectionPriceModel");
// const EventSeatLabel = require("./eventSeatLabel/EventSeatLabelModel");
// const Vendor = require("./vendor/VendorModel");
// const PartyPlot = require("./partyPlot/PartyPlotModel");
// const PartyPlotTicket = require("./partyPlot/PartyPlotTicketModel");
// const PartyPlotBooking = require("./partyPlot/PartyPlotBookings");
// // ── User ─────────────────────────────────────────────────
// User.hasMany(Hall, { foreignKey: "created_by", as: "createdHalls" });
// Hall.belongsTo(User, { foreignKey: "created_by", as: "creator" });
// User.hasMany(Event, { foreignKey: "organizer_id", as: "organizedEvents" });
// Event.belongsTo(User, { foreignKey: "organizer_id", as: "organizer" });
// User.hasMany(Booking, { foreignKey: "user_id" });
// Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });
// User.hasMany(RefreshToken, { foreignKey: "user_id", onDelete: "CASCADE" });
// RefreshToken.belongsTo(User, { foreignKey: "user_id" });

// // ── Category ─────────────────────────────────────────────
// Category.hasMany(Event, { foreignKey: "category_id" });
// Event.belongsTo(Category, { foreignKey: "category_id" });

// // ── Hall → Seat (FLAT — no section/row tables) ───────────
// Hall.hasMany(Seat, { foreignKey: "hall_id", as: "seats", onDelete: "CASCADE" });
// Seat.belongsTo(Hall, { foreignKey: "hall_id", as: "hall" });

// // ── Hall → Event ─────────────────────────────────────────
// // Hall.hasMany(Event, { foreignKey: "hall_id" });

// // Event.belongsTo(Hall, { foreignKey: "hall_id" });
// Hall.hasMany(Event, {
//   foreignKey: "hall_id",
//   as: "events",
// });
// Event.belongsTo(Hall, {
//   foreignKey: "hall_id",
//   as: "hall",
// });
// // ── Event / Booking ──────────────────────────────────────
// Event.hasMany(Booking, { foreignKey: "event_id" });
// Booking.belongsTo(Event, { foreignKey: "event_id", as: "event" });
// Booking.hasMany(BookingSeat, { foreignKey: "booking_id" });
// BookingSeat.belongsTo(Booking, { foreignKey: "booking_id" });
// Event.hasMany(BookingSeat, { foreignKey: "event_id" });
// BookingSeat.belongsTo(Event, { foreignKey: "event_id" });
// Seat.hasMany(BookingSeat, { foreignKey: "seat_id" });
// BookingSeat.belongsTo(Seat, { foreignKey: "seat_id", as: "seat" });

// // ── Wishlist ─────────────────────────────────────────────
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
// Role.hasMany(User, { foreignKey: "role_id", as: "users" });

// // ── Event Section Prices ─────────────────────────────────
// Event.hasMany(EventSectionPrice, {
//   foreignKey: "event_id",
//   as: "sectionPrices",
//   onDelete: "CASCADE",
// });
// EventSectionPrice.belongsTo(Event, { foreignKey: "event_id" });

// // User.hasOne(Vendor, {
// // ── Event Seat Labels (event-specific overrides) ──────
// Event.hasMany(EventSeatLabel, {
//   foreignKey: "event_id",
//   as: "seatLabels",
//   onDelete: "CASCADE",
// });
// EventSeatLabel.belongsTo(Event, { foreignKey: "event_id" });
// Seat.hasMany(EventSeatLabel, { foreignKey: "seat_id" });
// EventSeatLabel.belongsTo(Seat, { foreignKey: "seat_id" });

// User.hasOne(Vendor, {
//   foreignKey: "user_id",
//   as: "vendorProfile",
//   onDelete: "CASCADE",
// });

// Vendor.belongsTo(User, {
//   foreignKey: "user_id",
//   as: "user",
// });

// // PartyPlot associations
// User.hasMany(PartyPlot, {
//   foreignKey: "created_by",
//   as: "partyPlots",
// });
// PartyPlot.belongsTo(User, {
//   foreignKey: "created_by",
//   as: "creator",
// });

// PartyPlot.hasMany(PartyPlotTicket, {
//   foreignKey: "party_plot_id",
//   as: "tickets",
//   onDelete: "CASCADE",
// });
// PartyPlotTicket.belongsTo(PartyPlot, {
//   foreignKey: "party_plot_id",
//   as: "partyPlot",
// });

// PartyPlotTicket.belongsTo(User, {
//   foreignKey: "booked_by",
//   as: "bookedUser",
// });
// PartyPlotTicket.belongsTo(PartyPlotBooking, {
//   foreignKey: "party_plot_booking_id",
//   as: "booking",
// });
// PartyPlotBooking.hasMany(PartyPlotTicket, {
//   foreignKey: "party_plot_booking_id",
//   as: "tickets",
// });

// User.hasMany(PartyPlotBooking, {
//   foreignKey: "user_id",
//   as: "partyPlotBookings",
// });

// PartyPlotBooking.belongsTo(User, {
//   foreignKey: "user_id",
//   as: "user",
// });

// PartyPlot.hasMany(PartyPlotBooking, {
//   foreignKey: "party_plot_id",
//   as: "bookings",
// });

// PartyPlotBooking.belongsTo(PartyPlot, {
//   foreignKey: "party_plot_id",
//   as: "partyPlot",
// });
// module.exports = {
//   sequelize,
//   User,
//   Role,
//   Category,
//   Hall,
//   Seat,
//   Event,
//   Booking,
//   BookingSeat,
//   Banner,
//   Notification,
//   Wishlist,
//   RefreshToken,
//   EventSectionPrice,
//   EventSeatLabel,
//   Vendor,
//   PartyPlot,
//   PartyPlotTicket,
//   PartyPlotBooking,
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
const EventSeatLabel = require("./eventSeatLabel/EventSeatLabelModel");

const Vendor = require("./vendor/VendorModel");

const PartyPlot = require("./partyPlot/PartyPlotModel");
const PartyPlotTicket = require("./partyPlot/PartyPlotTicketModel");

const EventTicketAssignment = require("./ticketChecker/EventTicketAssignmentModel");
const PartyPlotTicketAssignment = require("./ticketChecker/PartyPlotTicketAssignmentModel");
const EventTicketScan = require("./ticketChecker/EventTicketScanModel");

// IMPORTANT
// YOUR FILE MUST EXPORT A SEQUELIZE MODEL
const PartyPlotBooking = require("./partyPlot/PartyPlotBookings");

/* =========================================================
   USER RELATIONS
========================================================= */

User.hasMany(Hall, {
  foreignKey: "created_by",
  as: "createdHalls",
});

Hall.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

User.hasMany(Event, {
  foreignKey: "organizer_id",
  as: "organizedEvents",
});

Event.belongsTo(User, {
  foreignKey: "organizer_id",
  as: "organizer",
});

User.hasMany(Booking, {
  foreignKey: "user_id",
});

Booking.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
});

/* =========================================================
   CATEGORY RELATIONS
========================================================= */

Category.hasMany(Event, {
  foreignKey: "category_id",
});

Event.belongsTo(Category, {
  foreignKey: "category_id",
});

/* =========================================================
   HALL / SEAT RELATIONS
========================================================= */

Hall.hasMany(Seat, {
  foreignKey: "hall_id",
  as: "seats",
  onDelete: "CASCADE",
});

Seat.belongsTo(Hall, {
  foreignKey: "hall_id",
  as: "hall",
});

/* =========================================================
   EVENT RELATIONS
========================================================= */

Hall.hasMany(Event, {
  foreignKey: "hall_id",
  as: "events",
});

Event.belongsTo(Hall, {
  foreignKey: "hall_id",
  as: "hall",
});

/* =========================================================
   BOOKING RELATIONS
========================================================= */

Event.hasMany(Booking, {
  foreignKey: "event_id",
});

Booking.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

Booking.hasMany(BookingSeat, {
  foreignKey: "booking_id",
});

BookingSeat.belongsTo(Booking, {
  foreignKey: "booking_id",
});

Event.hasMany(BookingSeat, {
  foreignKey: "event_id",
});

BookingSeat.belongsTo(Event, {
  foreignKey: "event_id",
});

Seat.hasMany(BookingSeat, {
  foreignKey: "seat_id",
});

BookingSeat.belongsTo(Seat, {
  foreignKey: "seat_id",
  as: "seat",
});

/* =========================================================
   WISHLIST
========================================================= */

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

/* =========================================================
   ROLE
========================================================= */

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

/* =========================================================
   EVENT SECTION PRICES
========================================================= */

Event.hasMany(EventSectionPrice, {
  foreignKey: "event_id",
  as: "sectionPrices",
  onDelete: "CASCADE",
});

EventSectionPrice.belongsTo(Event, {
  foreignKey: "event_id",
});

/* =========================================================
   EVENT SEAT LABELS
========================================================= */

Event.hasMany(EventSeatLabel, {
  foreignKey: "event_id",
  as: "seatLabels",
  onDelete: "CASCADE",
});

EventSeatLabel.belongsTo(Event, {
  foreignKey: "event_id",
});

Seat.hasMany(EventSeatLabel, {
  foreignKey: "seat_id",
});

EventSeatLabel.belongsTo(Seat, {
  foreignKey: "seat_id",
});

/* =========================================================
   VENDOR
========================================================= */

User.hasOne(Vendor, {
  foreignKey: "user_id",
  as: "vendorProfile",
  onDelete: "CASCADE",
});

Vendor.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================================================
   PARTY PLOT
========================================================= */

User.hasMany(PartyPlot, {
  foreignKey: "created_by",
  as: "partyPlots",
});

PartyPlot.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

/* =========================================================
   PARTY PLOT BOOKINGS
========================================================= */

User.hasMany(PartyPlotBooking, {
  foreignKey: "user_id",
  as: "partyPlotBookings",
});

PartyPlotBooking.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

PartyPlot.hasMany(PartyPlotBooking, {
  foreignKey: "party_plot_id",
  as: "bookings",
});

PartyPlotBooking.belongsTo(PartyPlot, {
  foreignKey: "party_plot_id",
  as: "partyPlot",
});

/* =========================================================
   PARTY PLOT TICKETS
========================================================= */

PartyPlot.hasMany(PartyPlotTicket, {
  foreignKey: "party_plot_id",
  as: "tickets",
  onDelete: "CASCADE",
});

PartyPlotTicket.belongsTo(PartyPlot, {
  foreignKey: "party_plot_id",
  as: "partyPlot",
});

PartyPlotTicket.belongsTo(User, {
  foreignKey: "booked_by",
  as: "bookedUser",
});

User.hasMany(PartyPlotTicket, {
  foreignKey: "booked_by",
  as: "bookedTickets",
});

PartyPlotTicket.belongsTo(PartyPlotBooking, {
  foreignKey: "party_plot_booking_id",
  as: "booking",
});

PartyPlotBooking.hasMany(PartyPlotTicket, {
  foreignKey: "party_plot_booking_id",
  as: "tickets",
});

/* =========================================================
   TICKET CHECKER ASSIGNMENTS
========================================================= */

User.hasMany(EventTicketAssignment, {
  foreignKey: "user_id",
  as: "eventTicketAssignments",
});

EventTicketAssignment.belongsTo(User, {
  foreignKey: "user_id",
  as: "ticketChecker",
});

Event.hasMany(EventTicketAssignment, {
  foreignKey: "event_id",
  as: "ticketCheckerAssignments",
});

EventTicketAssignment.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

User.hasMany(PartyPlotTicketAssignment, {
  foreignKey: "user_id",
  as: "partyPlotTicketAssignments",
});

PartyPlotTicketAssignment.belongsTo(User, {
  foreignKey: "user_id",
  as: "ticketChecker",
});

PartyPlot.hasMany(PartyPlotTicketAssignment, {
  foreignKey: "party_plot_id",
  as: "ticketCheckerAssignments",
});

PartyPlotTicketAssignment.belongsTo(PartyPlot, {
  foreignKey: "party_plot_id",
  as: "partyPlot",
});

User.hasMany(EventTicketScan, {
  foreignKey: "scanned_by",
  as: "eventTicketScans",
});

EventTicketScan.belongsTo(User, {
  foreignKey: "scanned_by",
  as: "scanner",
});

Event.hasMany(EventTicketScan, {
  foreignKey: "event_id",
  as: "ticketScans",
});

EventTicketScan.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

Booking.hasMany(EventTicketScan, {
  foreignKey: "booking_id",
  as: "ticketScans",
});

EventTicketScan.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

/* =========================================================
   EXPORTS
========================================================= */

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
  EventSeatLabel,

  Vendor,

  PartyPlot,
  PartyPlotTicket,
  PartyPlotBooking,
  EventTicketAssignment,
  PartyPlotTicketAssignment,
  EventTicketScan,
};
