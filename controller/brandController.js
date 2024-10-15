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
    console.log(req.body.images);

    const { brand_id } = req.body;
    const {
      title,
      shortDes,
      author,
      status,
      metaDes,
      metaKey,
      metaTitle,
      isIndexed,
      images,
    } = req.body;

    const updatedBrand = await Brand.findByIdAndUpdate(
      brand_id,
      {
        title,
        shortDes,
        author,
        status,
        metaDes,
        metaKey,
        metaTitle,
        isIndexed,
        images, // Updating the images field
      },
      { new: true } // Option to return the updated document
    );

    res.status(200).json({
      status: 200,
      data: updatedBrand,
      message: "Brand updated successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Brand isn't updated.",
    });
  }
});

//Get a Brand
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.status(200).json({
      status: 200,
      data: getaBrand,
      message: "Brand Show successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Brand isn't showing.",
    });
  }
});

//Get all Brand
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.status(200).json({
      status: 200,
      data: getallBrand,
      message: "Brand show all successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Brand isn't show.",
    });
  }
});

//Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      data: deleteBrand,
      message: "Brand delete successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Brand isn't delete.",
    });
  }
});
module.exports = {
  createBrand,
  updateBrand,
  getBrand,
  getAllBrand,
  deleteBrand,
};
