// // controllers/adminEventController.js
// const Event = require("../../models/event/EventModel");
// const User = require("../../models/user/UserModel");
// const Category = require("../../models/category/CategoryModel");
// const Hall = require("../../models/hall/HallModel");
// const { Op } = require("sequelize");

// // Reusable include
// const baseInclude = [
//   {
//     model: User,
//     as: "organizer",
//     attributes: ["id", "name", "email"],
//   },
//   {
//     model: Category,
//     as: "category",
//     attributes: ["id", "name"],
//   },
//   {
//     model: Hall,
//     as: "hall",
//     attributes: ["id", "name"],
//   },
// ];

// // GET /api/events

// exports.getAllEvents = async (req, res) => {
//   try {
//     let { page = 1, limit = 20, status, search, category_id } = req.query;

//     // =========================
//     // VALIDATION
//     // =========================
//     page = Number(page);
//     limit = Number(limit);

//     if (!Number.isInteger(page) || page < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "page must be a positive integer",
//       });
//     }

//     if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
//       return res.status(400).json({
//         success: false,
//         message: "limit must be between 1 and 100",
//       });
//     }

//     const offset = (page - 1) * limit;

//     const where = {};

//     if (status) {
//       const allowedStatus = ["draft", "pending", "approved", "rejected"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`,
//         });
//       }
//       where.status = status;
//     }

//     if (category_id) {
//       const catId = Number(category_id);
//       if (isNaN(catId)) {
//         return res.status(400).json({
//           success: false,
//           message: "category_id must be a number",
//         });
//       }
//       where.category_id = catId;
//     }

//     if (search && search.trim() !== "") {
//       where.title = {
//         [Op.like]: `%${search.trim()}%`,
//       };
//     }

//     // =========================
//     // QUERY
//     // =========================
//     const { rows, count } = await Event.findAndCountAll({
//       where,
//       include: [
//         {
//           model: Category,
//           attributes: ["id", "name"],
//         },
//         {
//           model: User,
//           as: "organizer",
//           attributes: ["id", "name", "email"],
//         },
//         {
//           model: Hall,
//           attributes: ["id", "name", "city"],
//         },
//       ],
//       limit,
//       offset,
//       order: [["created_at", "DESC"]],
//       distinct: true,
//     });

//     return res.json({
//       success: true,
//       data: rows,
//       pagination: {
//         total: count,
//         page,
//         limit,
//         totalPages: Math.ceil(count / limit),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Events Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message, // IMPORTANT: show real error
//     });
//   }
// };
// // GET /api/events/:id
// exports.getEventById = async (req, res) => {
//   try {
//     const event = await Event.findByPk(req.params.id, {
//       include: baseInclude,
//     });

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: event,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // POST /api/events
// exports.createEvent = async (req, res) => {
//   try {
//     const {
//       organizer_id,
//       hall_id,
//       category_id,
//       title,
//       description,
//       event_date,
//       start_time,
//       end_time,
//       city,
//       address,
//       ticket_price = 0,
//       total_tickets = 0,
//       is_free = false,
//     } = req.body;

//     // =========================
//     // VALIDATION
//     // =========================

//     if (!title || title.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "title is required",
//       });
//     }

//     if (!hall_id) {
//       return res.status(400).json({
//         success: false,
//         message: "hall_id is required",
//       });
//     }

//     if (!category_id) {
//       return res.status(400).json({
//         success: false,
//         message: "category_id is required",
//       });
//     }

//     if (!event_date) {
//       return res.status(400).json({
//         success: false,
//         message: "event_date is required",
//       });
//     }

//     if (!start_time || !end_time) {
//       return res.status(400).json({
//         success: false,
//         message: "start_time and end_time are required",
//       });
//     }

//     if (!city || city.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "city is required",
//       });
//     }

//     if (!address || address.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "address is required",
//       });
//     }

//     // =========================
//     // TYPE VALIDATION
//     // =========================

//     if (isNaN(hall_id)) {
//       return res.status(400).json({
//         success: false,
//         message: "hall_id must be a number",
//       });
//     }

//     if (isNaN(category_id)) {
//       return res.status(400).json({
//         success: false,
//         message: "category_id must be a number",
//       });
//     }

//     if (isNaN(ticket_price) || ticket_price < 0) {
//       return res.status(400).json({
//         success: false,
//         message: "ticket_price must be a valid number",
//       });
//     }

//     if (isNaN(total_tickets) || total_tickets < 0) {
//       return res.status(400).json({
//         success: false,
//         message: "total_tickets must be a valid number",
//       });
//     }

//     // Date validation
//     const date = new Date(event_date);
//     if (isNaN(date.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "invalid event_date format",
//       });
//     }

//     // =========================
//     // SLUG GENERATION
//     // =========================

//     const slug =
//       title
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "") +
//       "-" +
//       Date.now();

//     // =========================
//     // CREATE EVENT
//     // =========================

//     const event = await Event.create({
//       organizer_id: req.user?.id || organizer_id,
//       hall_id,
//       category_id,
//       title: title.trim(),
//       slug,
//       description,
//       event_date,
//       start_time,
//       end_time,
//       city: city.trim(),
//       address: address.trim(),
//       ticket_price,
//       total_tickets,
//       is_free: Boolean(is_free),
//       status: "approved",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Event created successfully",
//       data: {
//         id: event.id,
//         slug: event.slug,
//       },
//     });
//   } catch (error) {
//     console.error("Create Event Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Server error",
//     });
//   }
// };

// // PUT /api/events/:id
// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findByPk(req.params.id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     await event.update(req.body);

//     return res.json({
//       success: true,
//       message: "Event updated",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // PATCH /api/events/:id/approve
// exports.approveEvent = async (req, res) => {
//   await Event.update(
//     {
//       status: "approved",
//       published_at: new Date(),
//     },
//     {
//       where: { id: req.params.id },
//     },
//   );

//   return res.json({
//     success: true,
//     message: "Event approved & published",
//   });
// };

// // PATCH /api/events/:id/reject
// exports.rejectEvent = async (req, res) => {
//   const { reason } = req.body;

//   await Event.update(
//     {
//       status: "rejected",
//       rejection_reason: reason,
//     },
//     {
//       where: { id: req.params.id },
//     },
//   );

//   return res.json({
//     success: true,
//     message: "Event rejected",
//   });
// };

// // PATCH /api/events/:id/cancel
// exports.cancelEvent = async (req, res) => {
//   await Event.update(
//     {
//       status: "cancelled",
//     },
//     {
//       where: { id: req.params.id },
//     },
//   );

//   return res.json({
//     success: true,
//     message: "Event cancelled",
//   });
// };

// // DELETE /api/events/:id
// exports.deleteEvent = async (req, res) => {
//   await Event.destroy({
//     where: { id: req.params.id },
//   });

//   return res.json({
//     success: true,
//     message: "Event deleted",
//   });
// };

// // GET /api/events/stats/summary
// exports.getSummaryStats = async (req, res) => {
//   try {
//     const total = await Event.count();
//     const pending = await Event.count({
//       where: { status: "pending_approval" },
//     });
//     const approved = await Event.count({ where: { status: "approved" } });
//     const rejected = await Event.count({ where: { status: "rejected" } });
//     const cancelled = await Event.count({ where: { status: "cancelled" } });
//     const completed = await Event.count({ where: { status: "completed" } });

//     const sold = await Event.sum("sold_tickets");
//     const revenue = await Event.sum("ticket_price");

//     return res.json({
//       success: true,
//       data: {
//         total,
//         pending,
//         approved,
//         rejected,
//         cancelled,
//         completed,
//         total_sold: sold || 0,
//         total_revenue: revenue || 0,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// controllers/event/eventController.js

const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const Event = require("../../models/event/EventModel");
const User = require("../../models/user/UserModel");
const Category = require("../../models/category/CategoryModel");
const Hall = require("../../models/hall/HallModel");
const Seat = require("../../models/hall/HallSeatModel");
const BookingSeat = require("../../models/booking/BookingSeatModel");
const { Booking } = require("../../models");
const EventTicketAssignment = require("../../models/ticketChecker/EventTicketAssignmentModel");
const EventTicketScan = require("../../models/ticketChecker/EventTicketScanModel");
const EventSectionPrice = require("../../models/event/EventSectionPriceModel");
const { sequelize } = require("../../config/db");

// ─────────────────────────────────────────────
// Reusable include
// ─────────────────────────────────────────────
const baseInclude = [
  {
    model: User,
    as: "organizer",
    attributes: ["id", "name", "email"],
  },
  {
    model: Category,
    attributes: ["id", "name"],
  },
  {
    model: Hall,
    attributes: ["id", "name", "city"],
    as: "hall",
  },
];

// ─────────────────────────────────────────────
// GET /api/events
// ─────────────────────────────────────────────
// exports.getAllEvents = async (req, res) => {
//   try {
//     let { page = 1, limit = 20, status, search, category_id } = req.query;

//     page = Number(page);
//     limit = Number(limit);

//     const offset = (page - 1) * limit;

//     const where = {};

//     if (status) where.status = status;

//     if (category_id) where.category_id = Number(category_id);

//     if (search) {
//       where.title = {
//         [Op.like]: `%${search.trim()}%`,
//       };
//     }

//     const { rows, count } = await Event.findAndCountAll({
//       where,
//       include: baseInclude,
//       as: "events",
//       order: [["created_at", "DESC"]],
//       limit,
//       offset,
//       distinct: true,
//     });

//     return res.json({
//       success: true,
//       data: rows,
//       pagination: {
//         total: count,
//         page,
//         limit,
//         totalPages: Math.ceil(count / limit),
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const decodeAuthToken = (req) => {
  try {
    let token = req.headers.authorization || req.headers.Authorization;
    if (!token) return null;

    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded && decoded.id ? decoded : null;
  } catch (error) {
    return null;
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      status,
      search,
      category_id,
      organizer_id,
      upcoming,
      period,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (category_id) where.category_id = Number(category_id);
    if (organizer_id) {
      const orgId = Number(organizer_id);
      if (!Number.isNaN(orgId)) {
        where.organizer_id = orgId;
      }
    }

    if (search) {
      where.title = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const authUser = req.user || decodeAuthToken(req);
    if (authUser?.role === "vendor_organizer") {
      where.organizer_id = Number(authUser.id);
    }

    const periodValue = String(period || upcoming || "").toLowerCase();
    if (
      periodValue === "true" ||
      periodValue === "1" ||
      periodValue === "upcoming"
    ) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;
      where.event_date = {
        [Op.gte]: todayDate,
      };
    }

    if (periodValue === "past") {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;
      where.event_date = {
        [Op.lt]: todayDate,
      };
    }

    const orderClause = [];
    if (
      periodValue === "true" ||
      periodValue === "1" ||
      periodValue === "upcoming"
    ) {
      orderClause.push(["event_date", "ASC"], ["start_time", "ASC"]);
    } else if (periodValue === "past") {
      orderClause.push(["event_date", "DESC"], ["start_time", "DESC"]);
    } else {
      orderClause.push(["created_at", "DESC"]);
    }

    const { rows, count } = await Event.findAndCountAll({
      where,

      include: [
        {
          model: Hall,
          as: "hall",
        },
        {
          model: Category,
        },
        {
          model: User,
          as: "organizer",
        },
      ],

      order: orderClause,
      limit,
      offset,
      distinct: true,
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get events by category slug
exports.getEventsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    let { page = 1, limit = 20, status, search } = req.query;

    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    // First, find the category by slug
    const category = await Category.findOne({
      where: { slug: slug.toLowerCase().trim() },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Build where condition for events
    const where = {
      category_id: category.id,
    };

    if (status) where.status = status;

    if (search) {
      where.title = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const { rows, count } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Hall,
          as: "hall",
        },
        {
          model: Category,
        },
        {
          model: User,
          as: "organizer",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return res.json({
      success: true,
      data: rows,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTrendingEvents = async (req, res) => {
  try {
    let { page = 1, limit = 10, category_id } = req.query;

    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    const where = {
      is_trending: true,
      status: "approved", // Only show approved trending events
    };

    if (category_id) {
      where.category_id = Number(category_id);
    }

    const { rows, count } = await Event.findAndCountAll({
      where,

      include: [
        {
          model: Hall,
          as: "hall",
        },
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name", "email"],
        },
      ],

      order: [
        ["sold_tickets", "DESC"], // Optional: sort by popularity
        ["event_date", "ASC"],
      ],

      limit,
      offset,
      distinct: true,
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get Trending Events Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTrendingEventByIdOrSlug = async (req, res) => {
  try {
    const value = req.params.id;

    const where = isNaN(value)
      ? {
          slug: value,
          is_trending: true,
          status: "approved",
        }
      : {
          [Op.and]: [
            {
              is_trending: true,
              status: "approved",
            },
            {
              [Op.or]: [{ id: Number(value) }, { slug: value }],
            },
          ],
        };

    const event = await Event.findOne({
      where,
      include: [
        ...baseInclude,
        {
          model: EventSectionPrice,
          as: "sectionPrices",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Trending event not found",
      });
    }

    return res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────────
// GET /api/events/:id
// BASIC EVENT DETAIL
// ─────────────────────────────────────────────
// exports.getEventById = async (req, res) => {
//   try {
//     const event = await Event.findByPk(req.params.id, {
//       include: baseInclude,
//     });

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: event,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getEventById = async (req, res) => {
  try {
    const value = req.params.id;

    const where = isNaN(value)
      ? { slug: value }
      : {
          [Op.or]: [{ id: Number(value) }, { slug: value }],
        };

    const event = await Event.findOne({
      where,
      include: [
        ...baseInclude,
        {
          model: EventSectionPrice,
          as: "sectionPrices",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        slug: req.params.slug,
      },

      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Hall,
          as: "hall",
          attributes: ["id", "name", "city"],
        },
        {
          model: EventSectionPrice,
          as: "sectionPrices",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ⭐ GET /api/events/:id/booking-layout
// THIS IS WHAT YOU NEED FOR FRONTEND
// ─────────────────────────────────────────────
// exports.getBookingLayout = async (req, res) => {
//   try {
//     const eventId = req.params.id;

//     const event = await Event.findByPk(eventId, {
//       include: [
//         {
//           model: Hall,
//           attributes: ["id", "name", "city"],
//         },
//       ],
//     });

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     // All hall seats
//     const seats = await Seat.findAll({
//       where: {
//         hall_id: event.hall_id,
//         is_active: true,
//       },
//       order: [
//         ["sort_order", "ASC"],
//         ["id", "ASC"],
//       ],
//     });

//     // Booked seats for this event only
//     // const booked = await BookingSeat.findAll({
//     //   where: {
//     //     event_id: eventId,
//     //     status: "booked",
//     //   },
//     //   attributes: ["seat_id"],
//     // });

//     const booked = await BookingSeat.findAll({
//       where: {
//         event_id: eventId,
//       },
//       include: [
//         {
//           model: Booking,
//           attributes: ["id", "booking_ref", "status"],
//           include: [
//             {
//               model: User,
//               as: "user",
//               attributes: ["id", "name", "email", "phone"],
//             },
//           ],
//         },
//       ],
//     });
//     const seatMap = new Map();

//     booked.forEach((bs) => {
//       if (!bs.Booking) return;

//       seatMap.set(Number(bs.seat_id), {
//         booking_id: bs.Booking.id,
//         booking_ref: bs.Booking.booking_ref,
//         status: bs.Booking.status,

//         // 🔥 FIX HERE
//         user: bs.Booking.user || null,
//       });
//     });
//     const bookedSeatIds = booked.map((x) => Number(x.seat_id));

//     // merge seat status
//     // const finalSeats = seats.map((seat) => {
//     //   const plain = seat.toJSON();

//     //   return {
//     //     ...plain,
//     //     status: bookedSeatIds.includes(seat.id)
//     //       ? "sold"
//     //       : seat.is_space
//     //         ? "space"
//     //         : "available",
//     //   };
//     // });
//     const finalSeats = seats.map((seat) => {
//       const plain = seat.toJSON();

//       const bookingInfo = seatMap.get(seat.id);

//       return {
//         ...plain,

//         status: bookingInfo ? "sold" : seat.is_space ? "space" : "available",

//         booking: bookingInfo || null,
//       };
//     });

//     return res.json({
//       success: true,
//       data: {
//         event,
//         hall: event.Hall,
//         seats: finalSeats,
//         bookedSeatIds,
//         totalSeats: finalSeats.filter((x) => !x.is_space).length,
//         soldSeats: bookedSeatIds.length,
//         availableSeats:
//           finalSeats.filter((x) => !x.is_space).length - bookedSeatIds.length,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.getBookingLayout = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Hall,
          as: "hall",
          attributes: ["id", "name", "city"],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const seats = await Seat.findAll({
      where: {
        hall_id: event.hall_id,
        is_active: true,
      },
      order: [
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });

    const booked = await BookingSeat.findAll({
      where: {
        event_id: eventId,
      },
      include: [
        {
          model: Booking,
          as: "Booking",
          attributes: ["id", "booking_ref", "status"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
      ],
    });

    const seatMap = new Map();

    booked.forEach((bs) => {
      if (!bs.Booking) return;

      seatMap.set(Number(bs.seat_id), {
        booking_id: bs.Booking.id,
        booking_ref: bs.Booking.booking_ref,
        status: bs.Booking.status,
        user: bs.Booking.user || null,
      });
    });

    const bookedSeatIds = booked.map((x) => Number(x.seat_id));

    // const finalSeats = seats.map((seat) => {
    //   const plain = seat.toJSON();
    //   const bookingInfo = seatMap.get(seat.id);

    //   return {
    //     ...plain,
    //     status: bookingInfo ? "sold" : seat.is_space ? "space" : "available",
    //     booking: bookingInfo || null,
    //   };
    // });

    // Fetch event-specific section prices
    // Fetch event-specific section prices
    const sectionPriceRows = await EventSectionPrice.findAll({
      where: { event_id: eventId },
    });

    // Fetch event-specific seat labels
    const { EventSeatLabel } = require("../../models");
    const eventLabelRows = await EventSeatLabel.findAll({
      where: { event_id: eventId },
    });
    const eventLabelMap = {};
    eventLabelRows.forEach((el) => {
      eventLabelMap[Number(el.seat_id)] = el.label;
    });
    const sectionPriceMap = {};
    sectionPriceRows.forEach((sp) => {
      sectionPriceMap[sp.section_label] = Number(sp.price);
    });

    // const finalSeats = seats.map((seat) => {
    //   const plain = seat.toJSON();
    //   const bookingInfo = seatMap.get(seat.id);

    //   // Override price with event section price if set
    //   const eventPrice = sectionPriceMap[plain.section_label];

    //   return {
    //     ...plain,
    //     price: eventPrice !== undefined ? eventPrice : plain.price,
    //     status: bookingInfo ? "sold" : seat.is_space ? "space" : "available",
    //     booking: bookingInfo || null,
    //   };
    // });

    // return res.json({
    //   success: true,
    //   data: {
    //     event,
    //     hall: event.hall,
    //     seats: finalSeats,
    //     bookedSeatIds,
    //     totalSeats: finalSeats.filter((x) => !x.is_space).length,
    //     soldSeats: bookedSeatIds.length,
    //     availableSeats:
    //       finalSeats.filter((x) => !x.is_space).length - bookedSeatIds.length,
    //   },
    // });

    const finalSeats = seats.map((seat) => {
      const plain = seat.toJSON();
      const bookingInfo = seatMap.get(seat.id);
      const eventPrice = sectionPriceMap[plain.section_label];

      // Fix invalid fill colors
      const validFill = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(plain.fill)
        ? plain.fill
        : "#64748B";

      // Event-specific label overrides hall-level section_label
      const eventLabel = eventLabelMap[Number(plain.id)];

      return {
        ...plain,
        fill: validFill,
        section_label: eventLabel || plain.section_label,
        price: eventPrice !== undefined ? eventPrice : plain.price,
        status: bookingInfo ? "sold" : seat.is_space ? "space" : "available",
        booking: bookingInfo || null,
      };
    });

    // Build section summary from seats
    const sectionSummary = {};
    finalSeats
      .filter((s) => !s.is_space)
      .forEach((s) => {
        const key = s.section_label || "General";
        if (!sectionSummary[key]) {
          sectionSummary[key] = {
            label: key,
            fill: s.fill,
            total: 0,
            available: 0,
            sold: 0,
          };
        }
        sectionSummary[key].total++;
        if (s.status === "available") sectionSummary[key].available++;
        if (s.status === "sold") sectionSummary[key].sold++;
      });

    return res.json({
      success: true,
      data: {
        event,
        hall: event.hall,
        seats: finalSeats,
        bookedSeatIds,
        totalSeats: finalSeats.filter((x) => !x.is_space).length,
        soldSeats: bookedSeatIds.length,
        availableSeats:
          finalSeats.filter((x) => !x.is_space).length - bookedSeatIds.length,
        sectionSummary: Object.values(sectionSummary),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (req.user.role === "ticket_checker") {
      const assignment = await EventTicketAssignment.findOne({
        where: {
          event_id: eventId,
          user_id: req.user.id,
        },
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Event not assigned to this ticket checker.",
        });
      }
    }

    const bookings = await Booking.findAll({
      where: { event_id: eventId },
      order: [["booked_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Event Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.getAssignedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const where = {};

    if (req.user.role === "ticket_checker") {
      where.user_id = userId;
    } else if (req.query.user_id) {
      where.user_id = Number(req.query.user_id);
    }

    const assignments = await EventTicketAssignment.findAll({
      where,
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: Hall,
              as: "hall",
            },
            {
              model: Category,
            },
            {
              model: User,
              as: "organizer",
            },
          ],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: assignments.map((item) => item.event).filter(Boolean),
    });
  } catch (error) {
    console.error("Get Assigned Events Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.assignTicketCheckerToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const user = await User.findByPk(user_id);
    if (!user || user.role !== "ticket_checker") {
      return res.status(400).json({
        success: false,
        message: "Assigned user must have role ticket_checker",
      });
    }

    const [assignment] = await EventTicketAssignment.findOrCreate({
      where: {
        event_id: id,
        user_id,
      },
      defaults: {
        event_id: id,
        user_id,
        assigned_by: req.user.id,
      },
    });

    return res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Assign Ticket Checker Event Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.unassignTicketCheckerFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    await EventTicketAssignment.destroy({
      where: {
        event_id: id,
        user_id,
      },
    });

    return res.json({
      success: true,
      message: "Ticket checker unassigned from event",
    });
  } catch (error) {
    console.error("Unassign Ticket Checker Event Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.scanEventTicket = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode || typeof barcode !== "string") {
      return res.status(400).json({
        success: false,
        message: "barcode is required",
      });
    }

    const booking = await Booking.findOne({
      where: {
        booking_ref: barcode,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is not confirmed",
      });
    }

    if (req.user.role === "ticket_checker") {
      const assignment = await EventTicketAssignment.findOne({
        where: {
          user_id: req.user.id,
          event_id: booking.event_id,
        },
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "This ticket is not assigned to you",
        });
      }
    }

    const scan = await EventTicketScan.create({
      booking_id: booking.id,
      event_id: booking.event_id,
      scanned_by: req.user.id,
      barcode,
    });

    return res.json({
      success: true,
      data: {
        booking,
        scan,
      },
    });
  } catch (error) {
    console.error("Scan Event Ticket Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/events
// ─────────────────────────────────────────────
// exports.createEvent = async (req, res) => {
//   try {
//     const {
//       organizer_id,
//       hall_id,
//       category_id,
//       title,
//       description,
//       event_date,
//       start_time,
//       end_time,
//       city,
//       address,
//       ticket_price = 0,
//       total_tickets = 0,
//       is_free = false,
//     } = req.body;

//     const slug =
//       title
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "") +
//       "-" +
//       Date.now();

//     const event = await Event.create({
//       organizer_id: req.user?.id || organizer_id,
//       hall_id,
//       category_id,
//       title,
//       slug,
//       description,
//       event_date,
//       start_time,
//       end_time,
//       city,
//       address,
//       ticket_price,
//       total_tickets,
//       is_free,
//       status: "approved",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Event created",
//       data: event,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.createEvent = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       organizer_id,
//       hall_id,
//       category_id,
//       title,
//       description,
//       event_date,
//       start_time,
//       end_time,
//       city,
//       address,
//       ticket_price = 0,
//       total_tickets = 0,
//       is_free = false,
//       section_prices = [], // [{ section_label, price }]
//     } = req.body;

//     const slug =
//       title
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "") +
//       "-" +
//       Date.now();

//     const event = await Event.create(
//       {
//         organizer_id: req.user?.id || organizer_id,
//         hall_id,
//         category_id,
//         title,
//         slug,
//         description,
//         event_date,
//         start_time,
//         end_time,
//         city,
//         address,
//         ticket_price,
//         total_tickets,
//         is_free,
//         status: "approved",
//       },
//       { transaction: t },
//     );

//     // Save per-section prices if provided
//     if (section_prices.length > 0) {
//       await EventSectionPrice.bulkCreate(
//         section_prices.map((sp) => ({
//           event_id: event.id,
//           section_label: sp.section_label,
//           price: Number(sp.price) || 0,
//         })),
//         { transaction: t },
//       );
//     }

//     await t.commit();
//     return res
//       .status(201)
//       .json({ success: true, message: "Event created", data: event });
//   } catch (error) {
//     await t.rollback();
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.createEvent = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      organizer_id,
      hall_id,
      category_id,
      title,
      description,
      event_date,
      start_time,
      end_time,
      city,
      address,
      ticket_price = 0,
      total_tickets = 0,
      is_free = false,
      is_trending = false,
      language,
      event_type,
      status = "approved",
      published_at = null,
      rejection_reason = null,
      section_prices = [],
    } = req.body;

    // Uploaded banner image
    const banner_url = req.file ? `/uploads/events/${req.file.filename}` : null;

    // Slug
    const slug =
      title
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    // Create event
    const event = await Event.create(
      {
        organizer_id: req.user?.id || organizer_id,
        hall_id,
        category_id,
        title,
        slug,
        description,
        event_date,
        start_time,
        end_time,
        city,
        address,
        banner_url,
        ticket_price,
        total_tickets,
        is_free,
        is_trending,
        language,
        event_type,
        status,
        published_at,
        rejection_reason,
      },
      { transaction: t },
    );

    // Section prices
    if (Array.isArray(section_prices) && section_prices.length > 0) {
      await EventSectionPrice.bulkCreate(
        section_prices.map((sp) => ({
          event_id: event.id,
          section_label: sp.section_label,
          price: Number(sp.price) || 0,
        })),
        { transaction: t },
      );
    }

    await t.commit();

    // Fetch full event
    const createdEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Hall,
          as: "hall",
          attributes: ["id", "name", "city"],
        },
        {
          model: EventSectionPrice,
          as: "sectionPrices",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: createdEvent,
    });
  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────────
// PUT /api/events/:id
// ─────────────────────────────────────────────
// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findByPk(req.params.id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     await event.update(req.body);

//     return res.json({
//       success: true,
//       message: "Event updated",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updateEvent = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const event = await Event.findByPk(req.params.id);
//     if (!event) {
//       await t.rollback();
//       return res
//         .status(404)
//         .json({ success: false, message: "Event not found" });
//     }

//     const { section_prices = [], ...eventData } = req.body;

//     await event.update(eventData, { transaction: t });

//     // Update section prices — delete old, insert new
//     if (section_prices.length > 0) {
//       await EventSectionPrice.destroy({
//         where: { event_id: event.id },
//         transaction: t,
//       });
//       await EventSectionPrice.bulkCreate(
//         section_prices.map((sp) => ({
//           event_id: event.id,
//           section_label: sp.section_label,
//           price: Number(sp.price) || 0,
//         })),
//         { transaction: t },
//       );
//     }

//     await t.commit();
//     return res.json({ success: true, message: "Event updated" });
//   } catch (error) {
//     await t.rollback();
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

const fs = require("fs");
const path = require("path");

exports.updateEvent = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const { title, section_prices, ...eventData } = req.body;

    const allowedStatuses = [
      "draft",
      "pending_approval",
      "approved",
      "rejected",
      "cancelled",
      "completed",
    ];

    if (Object.prototype.hasOwnProperty.call(eventData, "status")) {
      const statusValue = String(eventData.status || "").trim();
      if (!allowedStatuses.includes(statusValue)) {
        delete eventData.status;
      } else {
        eventData.status = statusValue;
      }
    }

    // Update slug if title changed
    if (title && title !== event.title) {
      eventData.title = title;

      eventData.slug =
        title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") +
        "-" +
        Date.now();
    }

    // Handle new uploaded banner
    if (req.file) {
      // Delete old image
      if (event.banner_url) {
        const oldImagePath = path.join(__dirname, "../../", event.banner_url);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path
      eventData.banner_url = `/uploads/events/${req.file.filename}`;
    }

    // Update event
    await event.update(eventData, {
      transaction: t,
    });

    // Update section prices
    if (Array.isArray(section_prices)) {
      // Delete old
      await EventSectionPrice.destroy({
        where: {
          event_id: event.id,
        },
        transaction: t,
      });

      // Insert new
      if (section_prices.length > 0) {
        await EventSectionPrice.bulkCreate(
          section_prices.map((sp) => ({
            event_id: event.id,
            section_label: sp.section_label,
            price: Number(sp.price) || 0,
          })),
          { transaction: t },
        );
      }
    }

    await t.commit();

    // Fetch updated event
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Hall,
          as: "hall",
          attributes: ["id", "name", "city"],
        },
        {
          model: EventSectionPrice,
          as: "sectionPrices",
        },
      ],
    });

    return res.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─────────────────────────────────────────────
// PATCH /api/events/:id/approve
// ─────────────────────────────────────────────
exports.approveEvent = async (req, res) => {
  await Event.update(
    {
      status: "approved",
      published_at: new Date(),
    },
    {
      where: { id: req.params.id },
    },
  );

  return res.json({
    success: true,
    message: "Approved",
  });
};

// ─────────────────────────────────────────────
// PATCH /api/events/:id/reject
// ─────────────────────────────────────────────
exports.rejectEvent = async (req, res) => {
  await Event.update(
    {
      status: "rejected",
      rejection_reason: req.body.reason,
    },
    {
      where: { id: req.params.id },
    },
  );

  return res.json({
    success: true,
    message: "Rejected",
  });
};

// ─────────────────────────────────────────────
// PATCH /api/events/:id/cancel
// ─────────────────────────────────────────────
exports.cancelEvent = async (req, res) => {
  await Event.update(
    {
      status: "cancelled",
    },
    {
      where: { id: req.params.id },
    },
  );

  return res.json({
    success: true,
    message: "Cancelled",
  });
};

// ─────────────────────────────────────────────
// DELETE /api/events/:id
// ─────────────────────────────────────────────
exports.deleteEvent = async (req, res) => {
  await Event.destroy({
    where: { id: req.params.id },
  });

  return res.json({
    success: true,
    message: "Deleted",
  });
};

// ─────────────────────────────────────────────
// GET /api/events/stats/summary/all
// ─────────────────────────────────────────────
exports.getSummaryStats = async (req, res) => {
  try {
    const total = await Event.count();
    const approved = await Event.count({
      where: { status: "approved" },
    });

    const sold = await Event.sum("sold_tickets");

    return res.json({
      success: true,
      data: {
        total,
        approved,
        total_sold: sold || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
