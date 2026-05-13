const DrawTool = require("../../models/section/DrawTool");
const SeatShape = require("../../models/section/SeatShape");

exports.getDrawTools = async (req, res) => {
  try {
    const rows = await DrawTool.findAll({ order: [["display_order", "ASC"]] });
    res.json(rows.map((t) => ({ ...t.toJSON(), id: t.tool_key })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSeatShapes = async (req, res) => {
  try {
    const rows = await SeatShape.findAll();
    res.json(
      rows.map((s) => ({
        ...s.toJSON(),
        id: s.label.toLowerCase(),
        r: s.border_radius,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
