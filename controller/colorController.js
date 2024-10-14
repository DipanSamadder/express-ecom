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
    res.status(200).json({
      status: 200,
      data: updateColor,
      message: "Data update successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't update.",
    });
  }
});

//Get a Color
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getaColor = await Color.findById(id);

    res.status(200).json({
      status: 200,
      data: getaColor,
      message: "Show data successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't showing.",
    });
  }
});

//Get all Color
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const getallColor = await Color.find();
    console.log(`${getallColor} ----color Contorller`);

    res.status(200).json({
      status: 200,
      data: getallColor,
      message: "Show all color successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't showing.",
    });
  }
});

//Delete Color
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      data: deleteColor,
      message: "Delete data successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't deleted.",
    });
  }
});
module.exports = {
  createColor,
  updateColor,
  getColor,
  getAllColor,
  deleteColor,
};
