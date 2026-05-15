// controllers/partyPlot/partyPlotController.js

const {
  PartyPlot,
  PartyPlotTicket,
  PartyPlotBooking,
  User,
} = require("../../models");

const sendEmail = require("../../utils/sendEmail");
const sendSMS = require("../../utils/sendSMS");

// GET /api/party-plots
exports.getAllPartyPlots = async (req, res) => {
  try {
    const partyPlots = await PartyPlot.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: partyPlots,
    });
  } catch (error) {
    console.error("GET PARTY PLOTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// GET /api/party-plots/:id
exports.getPartyPlotById = async (req, res) => {
  try {
    const { id } = req.params;

    const partyPlot = await PartyPlot.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
        },
        {
          model: PartyPlotTicket,
          as: "tickets",
          include: [
            {
              model: User,
              as: "bookedUser",
              attributes: ["id", "name", "email"],
            },
            {
              model: PartyPlotBooking,
              as: "booking",
            },
          ],
        },
      ],
    });

    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    return res.json({
      success: true,
      data: partyPlot,
    });
  } catch (error) {
    console.error("GET PARTY PLOT ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
// POST /api/party-plots
exports.createPartyPlot = async (req, res) => {
  try {
    const { name, description, image, total_tickets } = req.body;

    const created_by = req.user.id;

    const partyPlot = await PartyPlot.create({
      name,
      description,
      image,
      total_tickets,
      available_tickets: total_tickets,
      created_by,
    });

    return res.status(201).json({
      success: true,
      data: partyPlot,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PUT /api/party-plots/:id
exports.updatePartyPlot = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, image } = req.body;

    const partyPlot = await PartyPlot.findByPk(id);

    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    await partyPlot.update({
      name,
      description,
      image,
    });

    return res.json({
      success: true,
      data: partyPlot,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE /api/party-plots/:id
exports.deletePartyPlot = async (req, res) => {
  try {
    const { id } = req.params;

    const partyPlot = await PartyPlot.findByPk(id);

    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    await partyPlot.destroy();

    return res.json({
      success: true,
      message: "Party plot deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// POST /api/party-plots/:id/create-tickets
exports.createTickets = async (req, res) => {
  try {
    const { id } = req.params;

    const { num_tickets } = req.body;

    const partyPlot = await PartyPlot.findByPk(id);

    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    const tickets = [];

    const existingTicketsCount = await PartyPlotTicket.count({
      where: {
        party_plot_id: id,
      },
    });

    for (let i = 0; i < Number(num_tickets); i++) {
      const ticketNumber = `${partyPlot.name
        .replace(/\s+/g, "")
        .toUpperCase()}-${String(existingTicketsCount + i + 1).padStart(
        4,
        "0",
      )}`;

      const barcode = `PP-${id}-${Date.now()}-${i}`;

      tickets.push({
        party_plot_id: id,
        ticket_number: ticketNumber,
        barcode,
        status: "available",
      });
    }

    await PartyPlotTicket.bulkCreate(tickets);

    await partyPlot.update({
      total_tickets: Number(partyPlot.total_tickets) + Number(num_tickets),

      available_tickets:
        Number(partyPlot.available_tickets) + Number(num_tickets),
    });

    return res.json({
      success: true,
      message: `${num_tickets} tickets created`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// POST /api/party-plots/:id/book-tickets
exports.bookTickets = async (req, res) => {
  try {
    const { id } = req.params;

    const { num_tickets } = req.body;

    const user_id = req.user.id;

    const partyPlot = await PartyPlot.findByPk(id);

    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    const availableTickets = await PartyPlotTicket.findAll({
      where: {
        party_plot_id: id,
        status: "available",
      },

      limit: Number(num_tickets),

      order: [["id", "ASC"]],
    });

    if (availableTickets.length < Number(num_tickets)) {
      return res.status(400).json({
        success: false,
        message: "Not enough available tickets",
      });
    }

    const bookingRef = `PP${Date.now()}`;

    const booking = await PartyPlotBooking.create({
      booking_ref: bookingRef,

      party_plot_id: id,

      user_id,

      total_tickets: Number(num_tickets),

      total_amount: 0,

      status: "confirmed",
    });

    for (const ticket of availableTickets) {
      await ticket.update({
        status: "booked",

        booked_by: user_id,

        party_plot_booking_id: booking.id,
      });
    }

    await partyPlot.update({
      available_tickets:
        Number(partyPlot.available_tickets) - Number(num_tickets),
    });

    const user = await User.findByPk(user_id);

    if (user) {
      const emailSubject = `Party Plot Tickets Booked - ${partyPlot.name}`;

      const emailHtml = `
        <h2>Party Plot Ticket Booking Confirmation</h2>

        <p>Hello ${user.name},</p>

        <p>
          Your booking for
          <strong>${partyPlot.name}</strong>
          is confirmed.
        </p>

        <p>
          Tickets:
          <strong>${num_tickets}</strong>
        </p>

        <p>
          Booking Ref:
          <strong>${bookingRef}</strong>
        </p>
      `;

      await sendEmail(user.email, emailSubject, emailHtml);

      if (user.mobile) {
        await sendSMS(user.mobile, `Party Plot booked. Ref: ${bookingRef}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Tickets booked successfully",

      data: {
        booking,
        tickets: availableTickets,
      },
    });
  } catch (error) {
    console.error("BOOK PARTY PLOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// POST /api/party-plots/scan-ticket
exports.scanTicket = async (req, res) => {
  try {
    const { barcode } = req.body;

    const ticket = await PartyPlotTicket.findOne({
      where: {
        barcode,
      },

      include: [
        {
          model: PartyPlot,
          as: "partyPlot",
        },
        {
          model: User,
          as: "bookedUser",
        },
        {
          model: PartyPlotBooking,
          as: "booking",
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.status !== "booked") {
      return res.status(400).json({
        success: false,
        message: "Ticket not booked or already used",
      });
    }

    await ticket.update({
      status: "used",
      used_at: new Date(),
    });

    return res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
