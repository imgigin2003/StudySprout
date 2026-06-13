const Plant = require("../models/Plant");

const createPlant = async (req, res) => {
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
    console.error("Error Creating Plant:", error);
    res
      .status(500)
      .json({ message: "Failed to create plant", error: error.message });
  }
};

const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json({ plants });
  } catch (error) {
    console.error("Error Fetching Plants: ", error);
    res
      .status(500)
      .json({ message: "Failed to fetch plants ", error: error.message });
  }
};

const getPlantById = async (req, res) => {
  try {
    const plantId = req.params.id;
    const getPlant = await Plant.findById(plantId);
    if (!getPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json({ plant: getPlant });
  } catch (error) {
    console.error("Error Fetching Plant: ", error);
    res
      .status(500)
      .json({ message: "Failed to fetch plant ", error: error.message });
  }
};
module.exports = { createPlant, getAllPlants, getPlantById };
