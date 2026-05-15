const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/partyPlot/partyPlotController");

const verifyToken = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

// Routes
router.get("/", verifyToken, ctrl.getAllPartyPlots);

router.get("/:id", verifyToken, ctrl.getPartyPlotById);

router.post("/", verifyToken, adminOnly, ctrl.createPartyPlot);

router.put("/:id", verifyToken, adminOnly, ctrl.updatePartyPlot);

router.delete("/:id", verifyToken, adminOnly, ctrl.deletePartyPlot);

router.post("/:id/create-tickets", verifyToken, adminOnly, ctrl.createTickets);

router.post("/:id/book-tickets", verifyToken, ctrl.bookTickets);

router.post("/scan-ticket", verifyToken, adminOnly, ctrl.scanTicket);
module.exports = router;
