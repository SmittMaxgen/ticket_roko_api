const Section = require("../../models/section/Section");

exports.getAll = async (req, res) => {
  try {
    const rows = await Section.findAll({ order: [["display_order", "ASC"]] });
    res.json(rows.map((s) => ({ ...s.toJSON(), id: s.id_key })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      id_key,
      label,
      color,
      price,
      seat_type,
      display_order = 0,
    } = req.body;
    const section = await Section.create({
      id_key,
      label,
      color,
      price,
      seat_type,
      display_order,
    });
    res.status(201).json({ ...section.toJSON(), id: section.id_key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { label, color, price, seat_type, display_order } = req.body;
    await Section.update(
      { label, color, price, seat_type, display_order },
      { where: { id_key: req.params.id_key } },
    );
    const updated = await Section.findOne({
      where: { id_key: req.params.id_key },
    });
    res.json({ ...updated.toJSON(), id: updated.id_key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Section.destroy({ where: { id_key: req.params.id_key } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
