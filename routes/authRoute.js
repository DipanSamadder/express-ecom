const express = require('express');
const {
createUser,
loginUrlCtrl,
getallUser,
getaUser,
deleteaUser,
updatedUser,
blockUser,
unblockUser,
handleRefreshtoken,
logout,
updatePassword,
forgotPasswordToken,
resetPassword,
loginAdmin,
getWishlist,
SaveAddress,
userCart,
getUserCart,
emptyCart,
applyCoupon,
createOrder,
getOrders,
updateOrderStatus
} = require("../controller/userController");

const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/admin-login", loginAdmin);
router.post("/register", createUser);
router.post("/login", loginUrlCtrl);

router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.post("/get-orders", authMiddleware, getOrders);
router.put("/order/update-order/:id", authMiddleware, updateOrderStatus);


router.post("/cart", authMiddleware, userCart);
router.get("/cart",  authMiddleware, getUserCart);

router.put("/passsword", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);

router.get("/refresh", handleRefreshtoken);
router.get("/forget-password-token",authMiddleware, forgotPasswordToken);
router.get("/wishlist",authMiddleware, getWishlist);
router.get("/logout", logout);
router.delete("/empty-cart", authMiddleware, emptyCart);


router.get("/all-user", authMiddleware, getallUser);
router.get("/:id", authMiddleware, getaUser);
router.put("/save-address", authMiddleware, SaveAddress);
router.delete("/:id", authMiddleware, deleteaUser);


router.put("/edit", authMiddleware, isAdmin, updatedUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;