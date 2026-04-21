// controllers/adminDashboardController.js

const { Op, fn, col, literal } = require("sequelize");

const User = require("../../models/user/UserModel");
const Event = require("../../models/event/EventModel");
const Booking = require("../../models/booking/BookingModel");
const Hall = require("../../models/hall/HallModel");
const Category = require("../../models/category/CategoryModel");

// GET /api/dashboard/overview
exports.getOverview = async (req, res) => {
  try {
    const users = {
      total: await User.count({ where: { is_active: 1 } }),
      organizers: await User.count({
        where: { is_active: 1, role: "organizer" },
      }),
      customers: await User.count({
        where: { is_active: 1, role: "user" },
      }),
      pending_kyc: await User.count({
        where: {
          is_active: 1,
          role: "organizer",
          kyc_status: "pending",
        },
      }),
    };

    const events = {
      total: await Event.count(),
      pending: await Event.count({
        where: { status: "pending_approval" },
      }),
      approved: await Event.count({
        where: { status: "approved" },
      }),
      completed: await Event.count({
        where: { status: "completed" },
      }),
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = {
      total: await Booking.count({
        where: { status: "confirmed" },
      }),
      revenue:
        (await Booking.sum("total_amount", {
          where: { status: "confirmed" },
        })) || 0,

      today: await Booking.count({
        where: {
          status: "confirmed",
          booked_at: {
            [Op.gte]: today,
          },
        },
      }),

      today_revenue:
        (await Booking.sum("total_amount", {
          where: {
            status: "confirmed",
            booked_at: {
              [Op.gte]: today,
            },
          },
        })) || 0,
    };

    const halls = {
      total: await Hall.count({
        where: { is_active: 1 },
      }),

      total_capacity:
        (await Hall.sum("total_capacity", {
          where: { is_active: 1 },
        })) || 0,
    };

    return res.json({
      success: true,
      data: { users, events, bookings, halls },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/dashboard/revenue-chart?period=30
exports.getRevenueChart = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.period) || 30, 90);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const rows = await Booking.findAll({
      attributes: [
        [fn("DATE", col("booked_at")), "date"],
        [fn("COUNT", col("id")), "bookings"],
        [fn("SUM", col("total_amount")), "revenue"],
      ],
      where: {
        status: "confirmed",
        booked_at: {
          [Op.gte]: startDate,
        },
      },
      group: [fn("DATE", col("booked_at"))],
      order: [[literal("date"), "ASC"]],
      raw: true,
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/dashboard/top-events
exports.getTopEvents = async (req, res) => {
  try {
    const rows = await Event.findAll({
      attributes: [
        "id",
        "title",
        "event_date",
        "sold_tickets",
        "total_tickets",
        "ticket_price",
        [literal("(sold_tickets * ticket_price)"), "revenue"],
      ],
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "color"],
        },
      ],
      where: {
        status: {
          [Op.in]: ["approved", "completed"],
        },
      },
      order: [[literal("revenue"), "DESC"]],
      limit: 10,
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/dashboard/recent-bookings
exports.getRecentBookings = async (req, res) => {
  try {
    const rows = await Booking.findAll({
      attributes: ["id", "booking_ref", "total_amount", "status", "booked_at"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Event,
          as: "event",
          attributes: ["id", "title"],
        },
      ],
      order: [["booked_at", "DESC"]],
      limit: 8,
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/dashboard/category-stats
exports.getCategoryStats = async (req, res) => {
  try {
    const rows = await Category.findAll({
      attributes: [
        "id",
        "name",
        "color",
        [fn("COUNT", col("events.id")), "event_count"],
        [
          fn("SUM", literal("(events.sold_tickets * events.ticket_price)")),
          "revenue",
        ],
      ],
      include: [
        {
          model: Event,
          as: "events",
          attributes: [],
          required: false,
          where: {
            status: {
              [Op.in]: ["approved", "completed"],
            },
          },
        },
      ],
      group: ["Category.id"],
      order: [[literal("revenue"), "DESC"]],
      raw: true,
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
