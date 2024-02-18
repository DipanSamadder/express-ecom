
const express = require("express");
const router = express.Router();
const {isAdmin,authMiddleware }= require("../middlewares/authMiddleware");
const {
createProduct,
getaProduct,
getAllProduct,
updateProduct,
deleteProduct,
addToWishLst,
rating
} = require("../controller/productController");


router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", getAllProduct);
router.put("/wishlist", authMiddleware, addToWishLst);
router.put("/rating", authMiddleware, rating);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;