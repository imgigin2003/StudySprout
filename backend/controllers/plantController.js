const Plant = require("../models/Plant");
const User = require("../models/User");

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

const getHarvestedPlants = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("harvestedPlants");
    res.status(200).json({
      harvestedPlants: user.harvestedPlants,
      stats: {
        streakDays: user.streakDays,
        totalXP: user.totalXP,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteHarvestedPlant = async (req, res, next) => {
  try {
    const { plantId } = req.body;
    if (!plantId)
      return res.status(400).json({ message: "Plant ID is required." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const exists = user.harvestedPlants.includes(plantId);
    if (!exists)
      return res
        .status(404)
        .json({ message: "Plant not found in harvested list." });

    user.harvestedPlants.pull(plantId);
    await user.save();
    await Plant.findByIdAndDelete(plantId);

    res.status(200).json({ message: "Plant removed from shelf." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlant,
  getAllPlants,
  getPlantById,
  getHarvestedPlants,
  deleteHarvestedPlant,
};
