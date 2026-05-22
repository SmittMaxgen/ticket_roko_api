// const express = require("express");
// const router = express.Router();

// const ctrl = require("../../controllers/partyPlot/partyPlotController");

// const verifyToken = require("../../middleware/auth");
// const role = require("../../middleware/role");
// const adminOnly = role("super_admin", "admin");
// const ticketCheckerAccess = role("super_admin", "admin", "ticket_checker");
// const { uploadTo } = require("../../middleware/partyplotUpload");
// // Routes
// router.get("/", ctrl.getAllPartyPlots);

// router.get("/:id", verifyToken, ctrl.getPartyPlotById);

// const uploadImage = uploadTo("party-plots").single("image");

// // ── Wrap multer so its errors return clean JSON (not Express default) ──
// const handleUpload = (req, res, next) => {
//   uploadImage(req, res, (err) => {
//     if (!err) return next();

//     // Multer-specific errors (file type, size limit, etc.)
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image must be under 5 MB." });
//     }
//     return res
//       .status(400)
//       .json({ success: false, message: err.message || "Upload error." });
//   });
// };

// router.post("/", verifyToken, adminOnly, handleUpload, ctrl.createPartyPlot);
// router.get("/assigned", ctrl.getAssignedPartyPlots);

// router.put("/:id", verifyToken, adminOnly, handleUpload, ctrl.updatePartyPlot);

// router.delete("/:id", verifyToken, adminOnly, ctrl.deletePartyPlot);

// router.post("/:id/create-tickets", verifyToken, adminOnly, ctrl.createTickets);

// router.post("/:id/book-tickets", verifyToken, ctrl.bookTickets);
// router.post(
//   "/:id/assign-ticket-checker",
//   verifyToken,
//   adminOnly,
//   ctrl.assignTicketCheckerToPartyPlot,
// );
// router.delete(
//   "/:id/unassign-ticket-checker",
//   verifyToken,
//   adminOnly,
//   ctrl.unassignTicketCheckerFromPartyPlot,
// );
// router.post("/scan-ticket", verifyToken, ticketCheckerAccess, ctrl.scanTicket);
// module.exports = router;

const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/partyPlot/partyPlotController");

const verifyToken = require("../../middleware/auth");
const role = require("../../middleware/role");

const adminOnly = role("super_admin", "admin");
const ticketCheckerAccess = role("super_admin", "admin", "ticket_checker");

const { uploadTo } = require("../../middleware/partyplotUpload");

// ---------------- Upload Setup ----------------
const uploadImage = uploadTo("party-plots").single("image");

// Wrap multer so its errors return clean JSON
const handleUpload = (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, message: "Image must be under 5 MB." });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Upload error.",
    });
  });
};

// ---------------- Routes ----------------

// Public / basic
router.get("/", ctrl.getAllPartyPlots);

// ✅ IMPORTANT: static routes FIRST (fixes your bug)
router.get("/assigned", verifyToken, ctrl.getAssignedPartyPlots);
router.post("/scan-ticket", verifyToken, ticketCheckerAccess, ctrl.scanTicket);

// ---------------- Dynamic routes ----------------
router.get("/:id", verifyToken, ctrl.getPartyPlotById);

router.post("/", verifyToken, adminOnly, handleUpload, ctrl.createPartyPlot);

router.put("/:id", verifyToken, adminOnly, handleUpload, ctrl.updatePartyPlot);

router.delete("/:id", verifyToken, adminOnly, ctrl.deletePartyPlot);

router.post("/:id/create-tickets", verifyToken, adminOnly, ctrl.createTickets);

router.post("/:id/book-tickets", verifyToken, ctrl.bookTickets);

router.post(
  "/:id/assign-ticket-checker",
  verifyToken,
  adminOnly,
  ctrl.assignTicketCheckerToPartyPlot,
);

router.delete(
  "/:id/unassign-ticket-checker",
  verifyToken,
  adminOnly,
  ctrl.unassignTicketCheckerFromPartyPlot,
);

module.exports = router;
