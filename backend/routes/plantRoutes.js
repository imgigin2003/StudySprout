const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");

const {
  createPlant,
  getAllPlants,
  getPlantById,
  getHarvestedPlants,
  deleteHarvestedPlant,
} = require("../controllers/plantController");

router.post("/", middleware.protect, createPlant);
router.get("/", middleware.protect, getAllPlants);
router.get("/harvested", middleware.protect, getHarvestedPlants);
router.delete("/harvested", middleware.protect, deleteHarvestedPlant);
router.get("/:id", middleware.protect, getPlantById);

module.exports = router;
