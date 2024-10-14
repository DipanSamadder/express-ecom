const Coupon = require("../models/couponModel");
const validatemongoDbId = require("../utils/validateMongodbid");
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);

    res.status(200).json({
      status: 200,
      data: newCoupon,
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

const getAllCoupons = asynHandler(async (req, res) => {
  try {
    const getCoupon = await Coupon.find();
    res.status(200).json({
      status: 200,
      data: getCoupon,
      message: "Data show successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't show.",
    });
  }
});
const getaCoupons = asynHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getCoupon = await Coupon.findById(id);
    res.status(200).json({
      status: 200,
      data: getCoupon,
      message: "Data show successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't show.",
    });
  }
});

const updateCoupons = asynHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 200,
      data: updateCoupon,
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

const deleteCoupons = asynHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      data: deleteCoupon,
      message: "Data delete successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't delete.",
    });
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  getaCoupons,
  updateCoupons,
  deleteCoupons,
};
