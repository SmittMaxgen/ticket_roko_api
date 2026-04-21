const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/category/categoryController");

/* GET ALL */
router.get("/", getCategories);

/* GET BY ID */
router.get("/:id", getCategoryById);

/* CREATE */
router.post("/", auth, adminOnly, createCategory);

/* UPDATE */
router.put("/:id", auth, adminOnly, updateCategory);

/* DELETE */
router.delete("/:id", auth, adminOnly, deleteCategory);

module.exports = router;
