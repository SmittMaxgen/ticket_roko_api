const { Op } = require("sequelize");
const Language = require("../../models/language/LanguageModel");

/* GET ALL */
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll({
      where: { is_active: true },
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error("Get Languages Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* GET BY ID OR SLUG */
exports.getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && id.trim() !== "";

    const whereClause = isNumeric
      ? { [Op.or]: [{ id: Number(id) }, { slug: id }] }
      : { slug: id };

    const language = await Language.findOne({ where: whereClause });

    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }

    return res.status(200).json({ success: true, data: language });
  } catch (error) {
    console.error("Get Language Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* CREATE */
exports.createLanguage = async (req, res) => {
  try {
    const { name, slug, code, is_active } = req.body;

    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required" });
    }

    const existing = await Language.findOne({
      where: { [Op.or]: [{ slug }, ...(code ? [{ code }] : [])] },
    });

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Slug or code already exists" });
    }

    const language = await Language.create({ name, slug, code, is_active });

    return res.status(201).json({ success: true, data: language });
  } catch (error) {
    console.error("Create Language Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* UPDATE */
exports.updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && id.trim() !== "";

    const whereClause = isNumeric
      ? { [Op.or]: [{ id: Number(id) }, { slug: id }] }
      : { slug: id };

    const language = await Language.findOne({ where: whereClause });

    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }

    const { name, slug, code, is_active } = req.body;

    await language.update({ name, slug, code, is_active });

    return res.status(200).json({ success: true, data: language });
  } catch (error) {
    console.error("Update Language Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* DELETE */
exports.deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && id.trim() !== "";

    const whereClause = isNumeric
      ? { [Op.or]: [{ id: Number(id) }, { slug: id }] }
      : { slug: id };

    const language = await Language.findOne({ where: whereClause });

    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }

    await language.destroy();

    return res.status(200).json({ success: true, message: "Language deleted" });
  } catch (error) {
    console.error("Delete Language Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
