const express = require("express");
const { createColor, getColor, getAllColor, deleteColor, updateColor } = require("../controller/colorController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", getColor);
router.get("/", getAllColor);
router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin,  updateColor);
router.delete("/:id", authMiddleware, isAdmin,  deleteColor);

module.exports = router;
