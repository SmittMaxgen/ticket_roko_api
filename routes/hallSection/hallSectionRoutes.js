const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getHallSections,
  getHallSectionById,
  createHallSection,
  updateHallSection,
  deleteHallSection,
} = require("../../controllers/hallSection/hallSectionController");

router.get("/", getHallSections);
router.get("/:id", getHallSectionById);

router.post("/", auth, adminOnly, createHallSection);
router.put("/:id", auth, adminOnly, updateHallSection);
router.delete("/:id", auth, adminOnly, deleteHallSection);

module.exports = router;
