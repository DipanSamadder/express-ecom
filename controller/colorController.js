const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validatemongoDbId = require("../utils/validateMongodbid");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.status(200).json({
      status: 200,
      data: newColor,
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

//Update Color
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateColor);
  } catch (err) {
    throw new Error(err);
  }
});

//Get a Color
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getaColor = await Color.findById(id);
    res.json(getaColor);
  } catch (err) {
    throw new Error(err);
  }
});

//Get all Color
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const getallColor = await Color.find();
    res.json(getallColor);
  } catch (err) {
    throw new Error(err);
  }
});

//Delete Color
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id);
    res.json(deleteColor);
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createColor,
  updateColor,
  getColor,
  getAllColor,
  deleteColor,
};
