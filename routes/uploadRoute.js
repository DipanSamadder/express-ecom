const express = require('express');
const { upload, uploadFile, editAltText, deleteFile } = require('../controller/uploadController');
const {isAdmin,authMiddleware }= require("../middlewares/authMiddleware");

const router = express.Router();

// Route to upload file
router.post('/', upload.array('images', 10), authMiddleware, isAdmin, uploadFile);

// Route to edit alt text
router.put('/:id', authMiddleware, isAdmin, editAltText);

// Route to delete a file
router.delete('/:id', authMiddleware, isAdmin, deleteFile);

module.exports = router;
