// controllers/adminHallController.js

const { sequelize } = require("../../config/db");
const Hall = require("../../models/hall/HallModel");
const User = require("../../models/user/UserModel");
const HallSection = require("../../models/hall/HallSectionsModel");
const HallRow = require("../../models/hall/HallRowModel");
const HallSeat = require("../../models/hall/HallSeatModel");

// GET /api/halls
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.findAll({
      where: { is_active: 1 },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
        },
        {
          model: HallSection,
          as: "sections",
          attributes: ["id"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const data = halls.map((hall) => ({
      ...hall.toJSON(),
      sections_count: hall.sections ? hall.sections.length : 0,
    }));

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/halls/:id
exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id, {
      include: [
        {
          model: HallSection,
          as: "sections",
          include: [
            {
              model: HallRow,
              as: "rows",
              include: [
                {
                  model: HallSeat,
                  as: "HallSeats",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    return res.json({
      success: true,
      data: hall,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/halls
exports.createHall = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      description,
      hall_type,
      address,
      city,
      sections = [],
    } = req.body;

    if (!name || !hall_type || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "name, hall_type, address, and city are required",
      });
    }

    const totalCapacity = sections.reduce((sum, section) => {
      return (
        sum +
        section.rows.reduce((rowSum, row) => {
          return rowSum + Number(row.total_seats || 0);
        }, 0)
      );
    }, 0);

    const hall = await Hall.create(
      {
        name,
        description,
        hall_type,
        total_capacity: totalCapacity,
        address,
        city,
        created_by: req.user.id,
      },
      { transaction },
    );

    for (let si = 0; si < sections.length; si++) {
      const sec = sections[si];

      const section = await HallSection.create(
        {
          hall_id: hall.id,
          name: sec.name,
          color: sec.color,
          sort_order: si,
        },
        { transaction },
      );

      for (let ri = 0; ri < sec.rows.length; ri++) {
        const row = sec.rows[ri];

        const createdRow = await HallRow.create(
          {
            section_id: section.id,
            row_label: row.row_label,
            total_seats: row.total_seats,
            sort_order: ri,
          },
          { transaction },
        );

        const seats = [];

        for (let sn = 1; sn <= row.total_seats; sn++) {
          seats.push({
            row_id: createdRow.id,
            seat_number: String(sn),
            seat_type: row.seat_type || "standard",
          });
        }

        if (seats.length) {
          await HallSeat.bulkCreate(seats, { transaction });
        }
      }
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      data: { id: hall.id },
      message: "Hall created",
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PUT /api/halls/:id
exports.updateHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    const { name, description, hall_type, address, city, is_active } = req.body;

    await hall.update({
      name,
      description,
      hall_type,
      address,
      city,
      is_active,
    });

    return res.json({
      success: true,
      message: "Hall updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE /api/halls/:id
exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    await hall.update({
      is_active: 0,
    });

    return res.json({
      success: true,
      message: "Hall deactivated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
