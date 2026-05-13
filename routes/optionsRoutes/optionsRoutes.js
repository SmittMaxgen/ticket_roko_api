const express = require("express");
const router = express.Router();
const sectionsCtrl = require("../../controllers/section/sectionsController");
const optionsCtrl = require("../../controllers/option/optionsController");

// Sections
router.get("/", sectionsCtrl.getAll);
router.post("/", sectionsCtrl.create);
router.put("/:id_key", sectionsCtrl.update);
router.delete("/:id_key", sectionsCtrl.remove);

// Draw Tools
router.get("/draw-tools", optionsCtrl.getDrawTools);

// Seat Shapes
router.get("/seat-shapes", optionsCtrl.getSeatShapes);

module.exports = router;
