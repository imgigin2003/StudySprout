const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const {
  plantSeed,
  getGarden,
  harvestPlant,
  updatePlantGrowth,
} = require("../controllers/gardenController");

router.get("/", middleware.protect, getGarden);
router.post("/plant", middleware.protect, plantSeed);
router.post("/harvest", middleware.protect, harvestPlant);
router.patch("/grow", middleware.protect, updatePlantGrowth);

module.exports = router;
