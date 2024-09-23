const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: 'No Alt Text',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
