const User = require("../models/User");
const Plant = require("../models/Plant");

const plantSeed = async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    const user = await User.findById(req.user.id);
    const { name, plant_type, growthDuration, xpValue, description } = req.body;
    const plantType = plant_type;
    const starterPlants = ["cactus", "rose"];
    if (user.streakDays < 7 && !starterPlants.includes(plantType)) {
      return res.status(403).json({
        message: "You need a 7-days Streak to unlock this plant type.",
      });
    }
    const newPlant = await Plant.create({
      name,
      plantType,
      growthDuration: growthDuration || 30,
      xpValue: xpValue || 100,
      description: description || "",
    });
    user.garden.push({ plant: newPlant._id });
    await user.save();
    await user.populate("garden.plant");

    res.status(201).json({
      message: "Planted the Seed successfully. ",
      garden: user.garden,
    });
  } catch (error) {
    console.error("plantSeed error:", error);
    next(error);
  }
};

const getGarden = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("garden.plant");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ garden: user.garden });
  } catch (error) {
    next(error);
  }
};

const harvestPlant = async (req, res, next) => {
  try {
    const { plotId, isEarlyMastery } = req.body;
    if (!plotId) {
      return res.status(400).json({ message: "Invalid Plot id." });
    }

    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(plotId);
    if (plot === null) {
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
    next(error);
  }
};

const removePlant = async (req, res, next) => {
  try {
    const { plotId } = req.body;
    if (!plotId) return res.status(400).json({ message: "Invalid Plot ID." });

    const user = await User.findById(req.user.id);
    const plot = user.garden.id(plotId);
    if (!plot) return res.status(404).json({ message: "Plot not found." });

    plot.deleteOne();
    await user.save();

    res.status(200).json({ message: "Plant removed successfully." });
  } catch (error) {
    next(error);
  }
};

const updatePlantGrowth = async (req, res, next) => {
  try {
    const { plotId, xpGained } = req.body;
    if (!plotId) {
      return res.status(400).json({ message: "Invalid Plot id." });
    }
    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(plotId);
    if (plot === null) {
      return res.status(404).json({ message: "Plot not found in the garden" });
    }
    plot.currentXP += xpGained;
    if (plot.currentXP >= plot.plant.xpValue) {
      plot.plantStatus = "ready to harvest";
    }
    await user.save();
    res.status(200).json({ message: "Growth updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  plantSeed,
  getGarden,
  harvestPlant,
  removePlant,
  updatePlantGrowth,
};
