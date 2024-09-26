const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    lavel: {
      type: Number,
      required: false,
      default: 1,
    },
    parent: {
      type: String,
      required: false,
    },
    shortDes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    images: {
      type: Array,
    },
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
module.exports = mongoose.model("BlogCategory", blogCategorySchema);
