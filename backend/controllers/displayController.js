const User = require("../models/User");

const displayPlant = async (req, res, next) => {
  try {
    const { plantId } = req.body;
    if (!plantId) {
      return res.status(400).json({ message: "Could't find plant id." });
    }
    const user = await User.findById(req.user.id);
    if (!user.harvestedPlants.some((id) => id.toString() === plantId)) {
      return res
        .status(403)
        .json({ message: "You don't own this plant in your inventory." });
    }
    if (user.windowDisplay.some((id) => id.toString() === plantId)) {
      return res
        .status(403)
        .json({ message: "You already have this on your display." });
    }
    user.windowDisplay.push(plantId);
    await user.save();
    await user.populate("windowDisplay");
    res.status(200).json({
      message: "Placed plant in the window successfully",
      windowDisplay: user.windowDisplay,
    });
  } catch (error) {
    next(error);
  }
};

const getDisplay = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("windowDisplay");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with the id." });
    }
    res.status(200).json({ windowDisplay: user.windowDisplay });
  } catch (error) {
    next(error);
  }
};

module.exports = { displayPlant, getDisplay };
