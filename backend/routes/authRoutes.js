const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const {
  newUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");

router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/profile", middleware.protect, getUserProfile);

module.exports = router;
