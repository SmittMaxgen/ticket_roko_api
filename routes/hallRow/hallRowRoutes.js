// routes/hall-row/hallRowRoutes.js

const router = require("express").Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");

const adminOnly = role("super_admin", "admin");

const {
  getRows,
  getRowById,
  createRow,
  updateRow,
  deleteRow,
} = require("../../controllers/hallRow/hallRowController");

router.get("/", auth, getRows);
router.get("/:id", auth, getRowById);

router.post("/", auth, adminOnly, createRow);
router.put("/:id", auth, adminOnly, updateRow);
router.delete("/:id", auth, adminOnly, deleteRow);

module.exports = router;
