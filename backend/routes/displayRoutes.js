const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const {
  displayPlant,
  getDisplay,
} = require("../controllers/displayController");

router.get("/", middleware.protect, getDisplay);
router.post("/", middleware.protect, displayPlant);

module.exports = router;
