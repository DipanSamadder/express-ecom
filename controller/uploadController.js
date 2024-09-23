const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const File = require('../models/uploadModel');

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Restrict formats
  },
});

const upload = multer({ storage });

// Controller to upload file
const uploadFile = async (req, res) => {
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
    
    try {
    const filePromises = req.files.map(async (file) => {
        const { altText } = req.body;

        const newFile = new File({
        url: file.path,
        publicId: file.filename,
        altText: altText || 'No Alt Text',
        });

        return await newFile.save();
    });

    const savedFiles = await Promise.all(filePromises);
    res.status(200).json({ message: 'Files uploaded successfully', data: savedFiles });
    } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    }
};

// Controller to edit alt text of an uploaded file
const editAltText = async (req, res) => {
  const { id } = req.params;
  const { altText } = req.body;

  try {
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    file.altText = altText;
    await file.save();
    res.status(200).json({ message: 'Alt text updated', data });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Controller to delete a file from Cloudinary and MongoDB
const deleteFile = async (req, res) => {
  const { id } = req.params;
 
  
  try {
    const file = await File.findById(id);
  
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }
  
  console.log('Deleting file from Cloudinary:', file.publicId);
  
  // Delete the file from Cloudinary
  await cloudinary.uploader.destroy(file.publicId);

  // Remove the file from the database
  await File.findByIdAndDelete(id);

  res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  upload,
  uploadFile,
  editAltText,
  deleteFile,
};
