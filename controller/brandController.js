const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validatemongoDbId = require("../utils/validateMongodbid");

const createBrand = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
      req.body.metaTitle = slugify(req.body.title);
      req.body.metaDes = slugify(req.body.title);
      req.body.metaKey = slugify(req.body.title);
    }
    const newBrand = await Brand.create(req.body);
    res.status(200).json({
      status: 200,
      data: newBrand,
      message: "Brand added successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Brand isn't added.",
    });
  }
});

//Update Brand
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBrand);
  } catch (err) {
    throw new Error(err);
  }
});

//Get a Brand
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.json(getaBrand);
  } catch (err) {
    throw new Error(err);
  }
});

//Get all Brand
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (err) {
    throw new Error(err);
  }
});

//Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json(deleteBrand);
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  getBrand,
  getAllBrand,
  deleteBrand,
};
