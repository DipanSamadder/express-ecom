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
logout
} = require("../controller/userController");
const {authMiddleware,
    isAdmin} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUrlCtrl);
router.get("/refresh", handleRefreshtoken);
router.get("/logout", logout);

router.get("/all-user", authMiddleware, getallUser);
router.get("/:id", authMiddleware, getaUser);

router.delete("/:id", authMiddleware, deleteaUser);
router.put("/edit", authMiddleware, isAdmin, updatedUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;