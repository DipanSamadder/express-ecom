const Category = require("../models/productCateModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validatemongoDbId = require("../utils/validateMongodbid");

const createCategory = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
      req.body.metaTitle = slugify(req.body.title);
      req.body.metaDes = slugify(req.body.title);
      req.body.metaKey = slugify(req.body.title);
    }
    const newCategory = await Category.create(req.body);
    res.status(200).json({
      status: 200,
      data: newCategory,
      message: "Data added successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't added.",
    });
  }
});

//Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (err) {
    throw new Error(err);
  }
});

//Get a Category
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (err) {
    throw new Error(err);
  }
});

//Get all Category
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (err) {
    throw new Error(err);
  }
});

//Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategory,
  deleteCategory,
};
