/*
routes/user/userRoutes.js
*/

const router = require("express").Router();

const auth = require("../../middleware/auth");

const adminOnly = require("../../middleware/role")("super_admin", "admin");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateKyc,
  getStats,
} = require("../../controllers/user/userController");

router.get("/stats/summary", auth, adminOnly, getStats);

router.get("/", auth, adminOnly, getUsers);

router.get("/:id", auth, adminOnly, getUserById);

router.post("/", auth, adminOnly, createUser);

router.put("/:id", auth, adminOnly, updateUser);

router.delete("/:id", auth, adminOnly, deleteUser);

router.patch("/:id/kyc", auth, adminOnly, updateKyc);

module.exports = router;
