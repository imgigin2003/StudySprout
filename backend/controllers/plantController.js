const Plant = require("../models/Plant");

const createPlant = async (req, res, next) => {
  const { name, plantType, xpValue, growthDuration, image, description } =
    req.body;

  try {
    const newPlant = await Plant.create({
      name,
      plantType,
      xpValue,
      growthDuration,
      image,
      description,
    });
    res
      .status(201)
      .json({ message: "Plant created successfully", plant: newPlant });
  } catch (error) {
    next(error);
  }
};

const getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find();
    res.status(200).json({ plants });
  } catch (error) {
    console.error("Error Fetching Plants: ", error);
    next(error);
  }
};

const getPlantById = async (req, res, next) => {
  try {
    const plantId = req.params.id;
    const getPlant = await Plant.findById(plantId);
    if (!getPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json({ plant: getPlant });
  } catch (error) {
    next(error);
  }
};
module.exports = { createPlant, getAllPlants, getPlantById };
