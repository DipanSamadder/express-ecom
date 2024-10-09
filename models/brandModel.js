const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    shortDes: {
      type: String,
      required: false,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    metaTitle: {
      type: String,
      required: false,
    },
    metaDes: {
      type: String,
      required: false,
    },
    metaKey: {
      type: String,
      required: false,
    },
    isIndexed: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Brand", brandSchema);
