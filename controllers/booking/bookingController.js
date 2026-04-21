// controllers/adminBookingController.js

const { Op } = require("sequelize");
const Booking = require("../../models/booking/BookingModel");
const User = require("../../models/user/UserModel");
const Event = require("../../models/event/EventModel");
const BookingSeat = require("../../models/booking/BookingSeatModel");
const HallSeat = require("../../models/hall/HallSeatModel");
const HallRow = require("../../models/hall/HallRowModel");
const HallSection = require("../../models/hall/HallSectionsModel");

const bookingInclude = [
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "email", "phone"],
  },
  {
    model: Event,
    as: "event",
    attributes: ["id", "title", "event_date"],
  },
];

// GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, event_id } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (event_id) where.event_id = event_id;

    const userWhere = {};
    if (search) {
      where.booking_ref = { [Op.like]: `%${search}%` };
      userWhere.name = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
          where: search ? userWhere : undefined,
          required: false,
        },
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "event_date"],
        },
      ],
      order: [["booked_at", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json({
      success: true,
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: bookingInclude,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const seats = await BookingSeat.findAll({
      where: { booking_id: req.params.id },
      include: [
        {
          model: HallSeat,
          as: "seat",
          attributes: ["id", "seat_number"],
          include: [
            {
              model: HallRow,
              as: "row",
              attributes: ["id", "row_label"],
              include: [
                {
                  model: HallSection,
                  as: "section",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json({
      success: true,
      data: {
        ...booking.toJSON(),
        seats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.update({
      status: "cancelled",
      payment_status: "refunded",
    });

    return res.json({
      success: true,
      message: "Booking cancelled & marked for refund",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/bookings/stats/summary
exports.getBookingStats = async (req, res) => {
  try {
    const total = await Booking.count();
    const confirmed = await Booking.count({ where: { status: "confirmed" } });
    const cancelled = await Booking.count({ where: { status: "cancelled" } });
    const pending = await Booking.count({ where: { status: "pending" } });
    const paid = await Booking.count({ where: { payment_status: "paid" } });

    const totalRevenue = await Booking.sum("total_amount");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.count({
      where: {
        booked_at: {
          [Op.gte]: today,
        },
      },
    });

    const todayRevenue = await Booking.sum("total_amount", {
      where: {
        booked_at: {
          [Op.gte]: today,
        },
      },
    });

    return res.json({
      success: true,
      data: {
        total,
        confirmed,
        cancelled,
        pending,
        paid,
        total_revenue: totalRevenue || 0,
        today_bookings: todayBookings || 0,
        today_revenue: todayRevenue || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
