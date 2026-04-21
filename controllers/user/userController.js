/*
controllers/user/userController.js
Using Sequelize Models instead of raw SQL
*/

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../../models");

/* GET USERS */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, is_active } = req.query;

    const offset = (page - 1) * limit;

    let where = {};

    if (role) where.role = role;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (is_active !== undefined)
      where.is_active = is_active === "1" || is_active === "true";

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "role",
        "is_active",
        "is_verified",
        "kyc_status",
        "last_login",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json({
      success: true,
      data: rows,
      total: count,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* GET USER BY ID */
exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "role",
      "is_active",
      "is_verified",
      "kyc_status",
      "kyc_doc_url",
      "last_login",
      "created_at",
    ],
  });

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  return res.json({
    success: true,
    data: user,
  });
};

/* CREATE USER */
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "name, email, password required",
      });

    const exists = await User.findOne({
      where: { email },
    });

    if (exists)
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password_hash: hash,
      role,
      is_active: true,
      is_verified: true,
    });

    return res.status(201).json({
      success: true,
      data: { id: user.id },
      message: "User created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* UPDATE USER */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const { name, phone, role, is_active, is_verified } = req.body;

    await user.update({
      name,
      phone,
      role,
      is_active,
      is_verified,
    });

    return res.json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  if (+req.params.id === req.user.id)
    return res.status(400).json({
      success: false,
      message: "Cannot delete yourself",
    });

  const user = await User.findByPk(req.params.id);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  user.is_active = false;
  await user.save();

  return res.json({
    success: true,
    message: "User deactivated",
  });
};

/* UPDATE KYC */
exports.updateKyc = async (req, res) => {
  const { kyc_status } = req.body;

  if (!["approved", "rejected"].includes(kyc_status))
    return res.status(400).json({
      success: false,
      message: "Invalid KYC status",
    });

  const user = await User.findByPk(req.params.id);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  await user.update({
    kyc_status,
    is_verified: kyc_status === "approved",
  });

  return res.json({
    success: true,
    message: `KYC ${kyc_status}`,
  });
};

/* USER STATS */
exports.getStats = async (req, res) => {
  const total = await User.count();

  const users = await User.count({
    where: { role: "user" },
  });

  const organizers = await User.count({
    where: { role: "organizer" },
  });

  const admins = await User.count({
    where: { role: "admin" },
  });

  const active = await User.count({
    where: { is_active: true },
  });

  const inactive = await User.count({
    where: { is_active: false },
  });

  const pending_kyc = await User.count({
    where: {
      role: "organizer",
      kyc_status: "pending",
    },
  });

  return res.json({
    success: true,
    data: {
      total,
      users,
      organizers,
      admins,
      active,
      inactive,
      pending_kyc,
    },
  });
};
