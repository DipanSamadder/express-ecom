const express = require("express");
const { createCategory, getCategory, getAllCategory, deleteCategory, updateCategory } = require("../controller/ProductCateController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", getCategory);
router.get("/", getAllCategory);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin,  updateCategory);
router.delete("/:id", authMiddleware, isAdmin,  deleteCategory);

module.exports = router;
