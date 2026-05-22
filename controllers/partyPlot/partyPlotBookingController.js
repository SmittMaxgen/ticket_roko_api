const { Op } = require("sequelize");

const {
  PartyPlot,
  PartyPlotTicket,
  PartyPlotBooking,
  User,
  PartyPlotTicketAssignment,
} = require("../../models");

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

exports.getBookings = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const limit = Number(req.query.limit || 20);

    const offset = (page - 1) * limit;

    const where = {};

    // USER BOOKINGS
    if (req.user.role === "user") {
      where.user_id = req.user.id;
    }

    // STATUS FILTER
    if (req.query.status) {
      where.status = req.query.status;
    }

    // SEARCH
    if (req.query.search) {
      where[Op.or] = [
        {
          booking_ref: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
      ];
    }

    if (req.user.role === "user") {
      where.user_id = req.user.id;
    }

    if (req.user.role === "ticket_checker") {
      const assignments = await PartyPlotTicketAssignment.findAll({
        where: { user_id: req.user.id },
        attributes: ["party_plot_id"],
      });
      const assignedPlotIds = assignments.map((item) => item.party_plot_id);

      if (req.query.party_plot_id) {
        const requestedPlotId = Number(req.query.party_plot_id);
        if (!assignedPlotIds.includes(requestedPlotId)) {
          return res.status(403).json({
            success: false,
            message:
              "Access denied. Party plot not assigned to this ticket checker.",
          });
        }
        where.party_plot_id = requestedPlotId;
      } else {
        if (!assignedPlotIds.length) {
          return res.status(200).json({
            success: true,
            data: [],
            total: 0,
            currentPage: page,
            totalPages: 0,
          });
        }
        where.party_plot_id = assignedPlotIds;
      }
    }

    const { rows, count } = await PartyPlotBooking.findAndCountAll({
      where,

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },

        {
          model: PartyPlot,
          as: "partyPlot",
        },

        {
          model: PartyPlotTicket,
          as: "tickets",
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,

      offset,
    });

    return res.status(200).json({
      success: true,

      data: rows,

      total: count,

      currentPage: page,

      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

/* =========================================================
   GET BOOKING BY ID
========================================================= */

exports.getBookingById = async (req, res) => {
  try {
    const booking = await PartyPlotBooking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },

        {
          model: PartyPlot,
          as: "partyPlot",
        },

        {
          model: PartyPlotTicket,
          as: "tickets",
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.user.role === "ticket_checker") {
      const assignment = await PartyPlotTicketAssignment.findOne({
        where: {
          party_plot_id: booking.party_plot_id,
          user_id: req.user.id,
        },
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. Booking belongs to a party plot not assigned to this ticket checker.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("GET BOOKING BY ID ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await PartyPlotBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,

        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,

      message: "Booking status updated",

      data: booking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

/* =========================================================
   DELETE BOOKING
========================================================= */

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await PartyPlotBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,

        message: "Booking not found",
      });
    }

    // RESET TICKETS
    await PartyPlotTicket.update(
      {
        status: "available",
        booked_by: null,
        party_plot_booking_id: null,
      },
      {
        where: {
          party_plot_booking_id: booking.id,
        },
      },
    );

    await booking.destroy();

    return res.status(200).json({
      success: true,

      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

/* =========================================================
   GET BOOKING STATS
========================================================= */

exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await PartyPlotBooking.count();

    const confirmedBookings = await PartyPlotBooking.count({
      where: {
        status: "confirmed",
      },
    });

    const cancelledBookings = await PartyPlotBooking.count({
      where: {
        status: "cancelled",
      },
    });

    const totalTicketsBooked = await PartyPlotTicket.count({
      where: {
        status: "booked",
      },
    });

    return res.status(200).json({
      success: true,

      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalTicketsBooked,
      },
    });
  } catch (error) {
    console.error("GET BOOKING STATS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};
