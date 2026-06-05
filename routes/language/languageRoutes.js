const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require("../../controllers/language/languageController");

/* GET ALL */
router.get("/", getLanguages);

/* GET BY ID OR SLUG */
router.get("/:id", getLanguageById);

/* CREATE */
router.post("/", auth, adminOnly, createLanguage);

/* UPDATE */
router.put("/:id", auth, adminOnly, updateLanguage);

/* DELETE */
router.delete("/:id", auth, adminOnly, deleteLanguage);

module.exports = router;
