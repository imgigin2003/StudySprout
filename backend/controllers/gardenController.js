const User = require("../models/User");
const Plant = require("../models/Plant");

const plantSeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, plantType, growthDuration, xpValue, description } = req.body;
    const starterPlants = ["Cactus", "Rose"];
    if (user.streakDays < 7 && !starterPlants.includes(plantType)) {
      return res.status(403).json({
        message: "You need a 7-days Streak to unlock this plant type.",
      });
    }
    const newPlant = await Plant.create({
      name,
      plantType,
      growthDuration,
      xpValue,
      description,
    });
    user.garden.push({ plant: newPlant._id });
    await user.save();
    await user.populate("garden.plant");
    res.status(201).json({
      message: "Planted the Seed successfully. ",
      garden: user.garden,
    });
  } catch (error) {
    console.error("Error Planting the seed. ", error);
    res
      .status(500)
      .json({ message: "Couldn't plant the seed", error: error.message });
  }
};

const getGarden = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("garden.plant");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ garden: user.garden });
  } catch (error) {
    console.error("Error fetching garden. ", error);
    res
      .status(500)
      .json({ message: "Couldn't fetch the garden", error: error.message });
  }
};

const harvestPlant = async (req, res) => {
  try {
    const { plotId, isEarlyMastery } = req.body;
    if (!plotId) {
      return res.status(400).json({ message: "Invalid Plot id." });
    }
    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(plotId);
    if (plot == null) {
      return res.status(404).json({ message: "Plot not found in the garden" });
    }
    const plantedTime = new Date(plot.plantedAt).getTime();
    // The plant is ready if Date.now() is greater than or equal to plantedTime + growthTime.
    const growthTime = plot.plant.growthDuration * 60 * 1000;
    if (Date.now() < plantedTime + growthTime && !isEarlyMastery) {
      return res.status(400).json({ message: "The Plant hasn't bloomed yet!" });
    }
    if (isEarlyMastery) {
      plot.plant.isMaster = true;
      await plot.plant.save();
      res.status(200).json({
        message: "Plant harvested successfully.",
        totalXP: user.totalXP,
        harvestedPlants: user.harvestedPlants,
      });
    }
    user.totalXP += plot.plant.xpValue;
    user.harvestedPlants.push(plot.plant._id);
    plot.deleteOne();
    await user.save();
    res.status(200).json({
      message: "Plant harvested successfully.",
      totalXP: user.totalXP,
      harvestedPlants: user.harvestedPlants,
    });
  } catch (error) {
    console.error("Error harvesting the plant. ", error);
    res
      .status(500)
      .json({ message: "Couldn't harvest the plant", error: error.message });
  }
};

const updatePlantGrowth = async (req, res) => {
  try {
    const { plotId, xpGained } = req.body;
    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(plotId);
    plot.currentXP += xpGained;
    if (plot.currentXP >= plot.plant.xpValue) {
      plot.plantStatus = "ready to harvest";
    }
    await user.save();
    res.status(200).json({ message: "Growth updated successfully" });
  } catch (error) {
    console.error("Error Updating the XP. ", error);
    res
      .status(500)
      .json({ message: "Couldn't Update the XP", error: error.message });
  }
};

module.exports = { plantSeed, getGarden, harvestPlant, updatePlantGrowth };
