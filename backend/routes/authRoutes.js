const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const {
  newUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/authController");

router.post("/register", newUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", middleware.protect, getUserProfile);

module.exports = router;
