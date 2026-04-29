const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/hall/hallController");

const verifyToken = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

// Routes
router.get("/stats", verifyToken, adminOnly, ctrl.getHallStats);

router.get("/", verifyToken, ctrl.getAllHalls);

router.get("/:id", verifyToken, ctrl.getHallById);

router.post("/", verifyToken, adminOnly, ctrl.createHall);

router.put("/:id", verifyToken, adminOnly, ctrl.updateHall);

router.delete("/:id", verifyToken, adminOnly, ctrl.deleteHall);

module.exports = router;
