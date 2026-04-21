// routes/adminHallRoutes.js

const router = require("express").Router();
const controller = require("../../controllers/hall/hallController");
// const { auth, adminOnly } = require("../middleware/auth");

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const adminOnly = role("super_admin", "admin");
router.use(auth, adminOnly);

router.get("/", controller.getAllHalls);
router.get("/:id", controller.getHallById);

router.post("/", controller.createHall);

router.put("/:id", controller.updateHall);

router.delete("/:id", controller.deleteHall);

module.exports = router;
