// controllers/adminBookingController.js

const { Op } = require("sequelize");
const Booking = require("../../models/booking/BookingModel");
const User = require("../../models/user/UserModel");
const Event = require("../../models/event/EventModel");
const BookingSeat = require("../../models/booking/BookingSeatModel");
const HallSeat = require("../../models/hall/HallSeatModel");
const HallRow = require("../../models/hall/HallRowModel");
const HallSection = require("../../models/hall/HallSectionsModel");
const {
  sequelize,
  Seat,
  Hall,
  EventSectionPrice,
  EventTicketAssignment,
} = require("../../models");

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

function makeBookingRef(id) {
  const year = new Date().getFullYear();
  return `BK${year}${String(id).padStart(6, "0")}`;
}

exports.createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { event_id, seat_ids, payment_method = "cash" } = req.body;

    if (
      !event_id ||
      !seat_ids ||
      !Array.isArray(seat_ids) ||
      !seat_ids.length
    ) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "event_id and seat_ids required",
      });
    }

    const event = await Event.findByPk(event_id, { transaction: t });

    if (!event) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status !== "approved") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Event not available",
      });
    }

    const seats = await Seat.findAll({
      where: {
        id: seat_ids,
        hall_id: event.hall_id,
        is_space: false,
        is_active: true,
      },
      transaction: t,
    });

    if (seats.length !== seat_ids.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Some seats invalid",
      });
    }

    const alreadyBooked = await BookingSeat.findAll({
      where: {
        event_id,
        seat_id: seat_ids,
        status: "booked",
      },
      transaction: t,
    });

    if (alreadyBooked.length > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Some seats already booked",
      });
    }

    // let subtotal = 0;

    // for (const seat of seats) {
    //   subtotal += Number(seat.price || event.ticket_price || 0);
    // }

    let subtotal = 0;

    for (const seat of seats) {
      // 1. Check event-specific section price first
      const sectionPrice = await EventSectionPrice.findOne({
        where: {
          event_id,
          section_label: seat.section_label,
        },
        transaction: t,
      });

      // Priority: EventSectionPrice → seat.price → event.ticket_price
      const seatPrice = Number(
        sectionPrice?.price || seat.price || event.ticket_price || 0,
      );

      subtotal += seatPrice;
    }

    // const convenience_fee = Math.round(subtotal * 0.05);
    // const total_amount = subtotal + convenience_fee;

    const total_amount = subtotal;

    const booking = await Booking.create(
      {
        booking_ref: "TEMP",
        event_id,
        user_id,
        total_seats: seat_ids.length,
        subtotal,
        convenience_fee: 0,
        total_amount,
        payment_status: "paid",
        payment_method,
        status: "confirmed",
      },
      { transaction: t },
    );

    await booking.update(
      {
        booking_ref: makeBookingRef(booking.id),
      },
      { transaction: t },
    );

    // for (const seat of seats) {
    //   await BookingSeat.create(
    //     {
    //       booking_id: booking.id,
    //       seat_id: seat.id,
    //       event_id,
    //       price: seat.price || event.ticket_price || 0,
    //       status: "booked",
    //     },
    //     { transaction: t },
    //   );
    // }
    for (const seat of seats) {
      const sectionPrice = await EventSectionPrice.findOne({
        where: { event_id, section_label: seat.section_label },
        transaction: t,
      });

      const seatPrice = Number(
        sectionPrice?.price || seat.price || event.ticket_price || 0,
      );

      await BookingSeat.create(
        {
          booking_id: booking.id,
          seat_id: seat.id,
          event_id,
          price: seatPrice, // ← correct per-seat price
          status: "booked",
        },
        { transaction: t },
      );
    }

    await event.update(
      {
        sold_tickets: Number(event.sold_tickets || 0) + seat_ids.length,
      },
      { transaction: t },
    );

    await t.commit();

    // 🔴 Real-time: push booked seats to all clients on this event
    const io = req.app.get("io");
    if (io) {
      io.to(`event:${event_id}`).emit("seats:booked", {
        event_id,
        seat_ids,
      });
    }

    return res.json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking_id: booking.id,
        booking_ref: booking.booking_ref,
        total_amount,
      },
    });
  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: "Booking failed",
      error: error.message,
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const rows = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Event,
          as: "event",
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

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

    if (req.user.role === "ticket_checker") {
      const assignments = await EventTicketAssignment.findAll({
        where: { user_id: req.user.id },
        attributes: ["event_id"],
      });
      const assignedEventIds = assignments.map((item) => item.event_id);

      if (!assignedEventIds.length) {
        return res.json({
          success: true,
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        });
      }

      if (event_id) {
        const requestedEventId = Number(event_id);
        if (!assignedEventIds.includes(requestedEventId)) {
          return res.status(403).json({
            success: false,
            message:
              "Access denied. Event not assigned to this ticket checker.",
          });
        }
        where.event_id = requestedEventId;
      } else {
        where.event_id = assignedEventIds;
      }
    } else if (event_id) {
      where.event_id = event_id;
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
// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findByPk(req.params.id, {
//       include: bookingInclude,
//     });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     const seats = await BookingSeat.findAll({
//       where: { booking_id: req.params.id },
//       include: [
//         {
//           model: HallSeat,
//           as: "seat",
//           attributes: ["id", "seat_number"],
//           include: [
//             {
//               model: HallRow,
//               as: "row",
//               attributes: ["id", "row_label"],
//               include: [
//                 {
//                   model: HallSection,
//                   as: "section",
//                   attributes: ["id", "name"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     return res.json({
//       success: true,
//       data: {
//         ...booking.toJSON(),
//         seats,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findOne({
//       where: {
//         id: req.params.id,
//         user_id: req.user.id,
//       },
//       include: [
//         {
//           model: Event,
//           as: "event",
//         },
//       ],
//     });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     const seats = await BookingSeat.findAll({
//       where: { booking_id: booking.id },
//       include: [
//         {
//           model: Seat,
//           as: "seat",
//         },
//       ],
//     });

//     return res.json({
//       success: true,
//       data: {
//         ...booking.toJSON(),
//         seats,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed",
//     });
//   }
// };
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user?.id;

    console.log("=== getBookingById Debug ===");
    console.log("Booking ID:", bookingId);
    console.log("User ID:", userId);

    if (!bookingId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        // user_id: userId,
      },
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: Hall,
              as: "hall",
              attributes: ["id", "name", "city", "address"],
            },
          ],
        },
        {
          model: User, // ← ADD THIS BLOCK
          as: "user",
          attributes: ["id", "name", "email", "phone"], // ← pick whatever fields you need
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    console.log("booking::::::::::::>>>>>>>>>>", booking);

    // if (!booking) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Booking not found or you don't have access",
    //   });
    // }

    // Fixed: Use correct column names from your seats table
    const bookingSeats = await BookingSeat.findAll({
      where: { booking_id: booking.id },
      include: [
        {
          model: Seat,
          as: "seat",
          // attributes: [
          //   "id",
          //   // "seat_no", // ← Most common in Indian projects
          //   // "row_no", // ← Most common
          //   // "price",
          //   // "section_name", // remove if not exist
          // ],
        },
      ],
      attributes: ["id", "price", "status"],
    });
    console.log("booking ", bookingSeats);
    const responseData = {
      ...booking.toJSON(),
      seats: bookingSeats.map((bs) => ({
        bookingSeatId: bs.id,
        ...bs.seat?.toJSON(),
        bookedPrice: bs.price || bs.seat?.price,
      })),
    };

    return res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getBookingById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

// PATCH /api/bookings/:id/cancel
// exports.cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByPk(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     await booking.update({
//       status: "cancelled",
//       payment_status: "refunded",
//     });

//     return res.json({
//       success: true,
//       message: "Booking cancelled & marked for refund",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

exports.cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Already cancelled",
      });
    }

    await booking.update(
      {
        status: "cancelled",
        payment_status: "refunded",
      },
      { transaction: t },
    );

    await BookingSeat.update(
      { status: "cancelled" },
      {
        where: { booking_id: booking.id },
        transaction: t,
      },
    );

    const event = await Event.findByPk(booking.event_id, {
      transaction: t,
    });

    await event.update(
      {
        sold_tickets:
          Number(event.sold_tickets || 0) - Number(booking.total_seats || 0),
      },
      { transaction: t },
    );

    await t.commit();

    return res.json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: "Cancel failed",
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
