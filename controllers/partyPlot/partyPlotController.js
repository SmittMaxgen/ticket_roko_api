// controllers/partyPlot/partyPlotController.js

const {
  PartyPlot,
  PartyPlotTicket,
  PartyPlotBooking,
  PartyPlotTicketAssignment,
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
const fileUrl = (req, file) =>
  file
    ? `${req.protocol}://${req.get("host")}/uploads/party-plots/${file.filename}`
    : null;

exports.createPartyPlot = async (req, res) => {
  try {
    const { name, description, total_tickets } = req.body;
    const created_by = req.user.id;

    // req.file is set by multer when an image is uploaded
    // falls back to a URL string sent in body (image field) if no file
    const image = req.file
      ? fileUrl(req, req.file) // uploaded file  → full URL
      : req.body.image || null; // URL string     → use as-is

    const tickets = parseInt(total_tickets, 10) || 0;

    const partyPlot = await PartyPlot.create({
      name,
      description,
      image,
      total_tickets: tickets,
      available_tickets: tickets, // on creation all tickets are available
      created_by,
    });

    return res.status(201).json({
      success: true,
      data: partyPlot,
    });
  } catch (error) {
    console.error("createPartyPlot error:", error);
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

exports.getAssignedPartyPlots = async (req, res) => {
  try {
    const userId = req.user.id;
    const where = {};

    if (req.user.role === "ticket_checker") {
      where.user_id = userId;
    } else if (req.query.user_id) {
      where.user_id = Number(req.query.user_id);
    }

    const assignments = await PartyPlotTicketAssignment.findAll({
      where,
      include: [
        {
          model: PartyPlot,
          as: "partyPlot",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: assignments.map((item) => item.partyPlot).filter(Boolean),
    });
  } catch (error) {
    console.error("Get Assigned Party Plots Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.assignTicketCheckerToPartyPlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const partyPlot = await PartyPlot.findByPk(id);
    if (!partyPlot) {
      return res.status(404).json({
        success: false,
        message: "Party plot not found",
      });
    }

    const user = await User.findByPk(user_id);
    if (!user || user.role !== "ticket_checker") {
      return res.status(400).json({
        success: false,
        message: "Assigned user must have role ticket_checker",
      });
    }

    const [assignment] = await PartyPlotTicketAssignment.findOrCreate({
      where: {
        party_plot_id: id,
        user_id,
      },
      defaults: {
        party_plot_id: id,
        user_id,
        assigned_by: req.user.id,
      },
    });

    return res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Assign Ticket Checker Party Plot Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.unassignTicketCheckerFromPartyPlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    await PartyPlotTicketAssignment.destroy({
      where: {
        party_plot_id: id,
        user_id,
      },
    });

    return res.json({
      success: true,
      message: "Ticket checker unassigned from party plot",
    });
  } catch (error) {
    console.error("Unassign Ticket Checker Party Plot Error:", error);
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

    if (req.user.role === "ticket_checker") {
      const assignment = await PartyPlotTicketAssignment.findOne({
        where: {
          user_id: req.user.id,
          party_plot_id: ticket.party_plot_id,
        },
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "This ticket is not assigned to you",
        });
      }
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
