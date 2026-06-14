const express = require("express");
const router = express.Router();
const {
  startSession,
  stopSession,
  completeSession,
} = require("../controllers/pomodoroController");
const middleware = require("../middleware/authMiddleware");

router.post("/start", middleware.protect, startSession);
router.post("/stop", middleware.protect, stopSession);
router.post("/complete", middleware.protect, completeSession);

module.exports = router;
