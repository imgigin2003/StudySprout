const User = require("../models/User");

const displayPlant = async (req, res) => {
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
    console.log("Error Putting plant on display", error);
    res.status(500).json({
      message: "Couldn't place plant on display. ",
      error: error.message,
    });
  }
};

const getDisplay = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("windowDisplay");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with the id." });
    }
    res.status(200).json({ windowDisplay: user.windowDisplay });
  } catch (error) {
    console.log("Error Fetching the display", error);
    res.status(500).json({
      message: "Couldn't get the display. ",
      error: error.message,
    });
  }
};

module.exports = { displayPlant, getDisplay };
