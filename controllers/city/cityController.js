const City = require("../../models/city/cityModel");

// ================= GET ALL =================
exports.getCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Get Cities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET BY ID =================
exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && id.trim() !== "";

    const whereClause = isNumeric
      ? { [Op.or]: [{ id: Number(id) }, { slug: id }] }
      : { slug: id };

    const city = await City.findOne({ where: whereClause });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Get City Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= CREATE =================
exports.createCity = async (req, res) => {
  try {
    const { name, state, is_active } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // spaces to hyphens
      .replace(/-+/g, "-"); // collapse multiple hyphens

    // Check duplicate
    const existing = await City.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "City already exists" });
    }

    const city = await City.create({ name, slug, state, is_active });

    return res.status(201).json({ success: true, data: city });
  } catch (error) {
    console.error("Create City Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= UPDATE =================
exports.updateCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await city.update(req.body);

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    console.error("Update City Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= DELETE =================
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await city.destroy();

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Delete City Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
