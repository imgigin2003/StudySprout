const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");

const {
  createPlant,
  getAllPlants,
  getPlantById,
} = require("../controllers/plantController");

router.post("/", middleware.protect, createPlant);
router.get("/", middleware.protect, getAllPlants);
router.get("/:id", middleware.protect, getPlantById);

module.exports = router;
