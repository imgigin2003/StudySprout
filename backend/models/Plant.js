const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plantType: { type: String, required: true, default: "Sunflower" },
  growthDuration: { type: Number, required: true, default: 0 },
  xpValue: { type: Number, default: 0 },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  isMaster: { type: Boolean, default: false },
});

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
