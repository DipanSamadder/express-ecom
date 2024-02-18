const express = require("express");
const { createCoupon, getAllCoupons, getaCoupons, updateCoupons, deleteCoupons } = require("../controller/couponController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin,  createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getaCoupons);
router.delete("/:id",authMiddleware, isAdmin,  deleteCoupons);
router.put("/:id", authMiddleware, isAdmin,  updateCoupons);

module.exports = router;