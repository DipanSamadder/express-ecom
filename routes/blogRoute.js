const express = require("express");
const { createBlog, getaBlog, getAllBlog, updateBlog, deleteBlog, likeBlog, dislikeBlog } = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router= express.Router();

router.post("/",authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware,  likeBlog);
router.put("/dislikes", authMiddleware,  dislikeBlog);
router.get("/:id", getaBlog);
router.get("/", getAllBlog);
router.put("/:id", authMiddleware, isAdmin,  updateBlog);
router.delete("/:id", authMiddleware, isAdmin,  deleteBlog);


module.exports= router;