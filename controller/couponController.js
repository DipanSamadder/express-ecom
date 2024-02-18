const Coupon = require("../models/couponModel");
const validatemongoDbId = require('../utils/validateMongodbid');
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const getAllCoupons = asynHandler(async (req, res) => {
    try{
        const getCoupon = await Coupon.find();
        res.json(getCoupon);
    }catch(err){
        throw new Error(err);
    }
});
const getaCoupons = asynHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const getCoupon = await Coupon.findById(id);
        res.json(getCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const updateCoupons = asynHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate(
            id,req.body,{new:true});
        res.json(updateCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const deleteCoupons = asynHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    }catch(err){
        throw new Error(err);
    }
});


module.exports = { createCoupon,getAllCoupons,getaCoupons,updateCoupons, deleteCoupons }
