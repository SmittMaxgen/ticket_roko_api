/*
routes/roleRoutes.js
Professional Role Routes
*/

const express = require("express");
const router = express.Router();

const roleController = require("../../controllers/role/roleController");

router.post("/", roleController.createRole);

router.get("/", roleController.getRoles);

router.get("/:id", roleController.getRoleById);

router.put("/:id", roleController.updateRole);

router.patch("/:id", roleController.updateRole);

router.delete("/:id", roleController.deleteRole);

module.exports = router;
