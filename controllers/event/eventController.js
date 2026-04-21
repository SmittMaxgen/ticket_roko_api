// controllers/adminEventController.js
const Event = require("../../models/event/EventModel");
const User = require("../../models/user/UserModel");
const Category = require("../../models/category/CategoryModel");
const Hall = require("../../models/hall/HallModel");
const { Op } = require("sequelize");

// Reusable include
const baseInclude = [
  {
    model: User,
    as: "organizer",
    attributes: ["id", "name", "email"],
  },
  {
    model: Category,
    as: "category",
    attributes: ["id", "name"],
  },
  {
    model: Hall,
    as: "hall",
    attributes: ["id", "name"],
  },
];

// GET /api/events

exports.getAllEvents = async (req, res) => {
  try {
    let { page = 1, limit = 20, status, search, category_id } = req.query;

    // =========================
    // VALIDATION
    // =========================
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "limit must be between 1 and 100",
      });
    }

    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      const allowedStatus = ["draft", "pending", "approved", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`,
        });
      }
      where.status = status;
    }

    if (category_id) {
      const catId = Number(category_id);
      if (isNaN(catId)) {
        return res.status(400).json({
          success: false,
          message: "category_id must be a number",
        });
      }
      where.category_id = catId;
    }

    if (search && search.trim() !== "") {
      where.title = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    // =========================
    // QUERY
    // =========================
    const { rows, count } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Hall,
          attributes: ["id", "name", "city"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
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
    console.error("❌ Get Events Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message, // IMPORTANT: show real error
    });
  }
};
// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: baseInclude,
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
      message: "Server error",
    });
  }
};

// POST /api/events
exports.createEvent = async (req, res) => {
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
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    if (!hall_id) {
      return res.status(400).json({
        success: false,
        message: "hall_id is required",
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "category_id is required",
      });
    }

    if (!event_date) {
      return res.status(400).json({
        success: false,
        message: "event_date is required",
      });
    }

    if (!start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "start_time and end_time are required",
      });
    }

    if (!city || city.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "city is required",
      });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "address is required",
      });
    }

    // =========================
    // TYPE VALIDATION
    // =========================

    if (isNaN(hall_id)) {
      return res.status(400).json({
        success: false,
        message: "hall_id must be a number",
      });
    }

    if (isNaN(category_id)) {
      return res.status(400).json({
        success: false,
        message: "category_id must be a number",
      });
    }

    if (isNaN(ticket_price) || ticket_price < 0) {
      return res.status(400).json({
        success: false,
        message: "ticket_price must be a valid number",
      });
    }

    if (isNaN(total_tickets) || total_tickets < 0) {
      return res.status(400).json({
        success: false,
        message: "total_tickets must be a valid number",
      });
    }

    // Date validation
    const date = new Date(event_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "invalid event_date format",
      });
    }

    // =========================
    // SLUG GENERATION
    // =========================

    const slug =
      title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    // =========================
    // CREATE EVENT
    // =========================

    const event = await Event.create({
      organizer_id: req.user?.id || organizer_id,
      hall_id,
      category_id,
      title: title.trim(),
      slug,
      description,
      event_date,
      start_time,
      end_time,
      city: city.trim(),
      address: address.trim(),
      ticket_price,
      total_tickets,
      is_free: Boolean(is_free),
      status: "approved",
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        id: event.id,
        slug: event.slug,
      },
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.update(req.body);

    return res.json({
      success: true,
      message: "Event updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PATCH /api/events/:id/approve
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
    message: "Event approved & published",
  });
};

// PATCH /api/events/:id/reject
exports.rejectEvent = async (req, res) => {
  const { reason } = req.body;

  await Event.update(
    {
      status: "rejected",
      rejection_reason: reason,
    },
    {
      where: { id: req.params.id },
    },
  );

  return res.json({
    success: true,
    message: "Event rejected",
  });
};

// PATCH /api/events/:id/cancel
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
    message: "Event cancelled",
  });
};

// DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  await Event.destroy({
    where: { id: req.params.id },
  });

  return res.json({
    success: true,
    message: "Event deleted",
  });
};

// GET /api/events/stats/summary
exports.getSummaryStats = async (req, res) => {
  try {
    const total = await Event.count();
    const pending = await Event.count({
      where: { status: "pending_approval" },
    });
    const approved = await Event.count({ where: { status: "approved" } });
    const rejected = await Event.count({ where: { status: "rejected" } });
    const cancelled = await Event.count({ where: { status: "cancelled" } });
    const completed = await Event.count({ where: { status: "completed" } });

    const sold = await Event.sum("sold_tickets");
    const revenue = await Event.sum("ticket_price");

    return res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        cancelled,
        completed,
        total_sold: sold || 0,
        total_revenue: revenue || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
