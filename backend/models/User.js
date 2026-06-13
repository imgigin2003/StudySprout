const Plant = require("./Plant");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lvlOfEducation: { type: String, required: false },
  major: { type: String, required: false },
  gardenName: { type: String, default: "My Garden" },
  garden: [
    {
      plant: { type: mongoose.Schema.Types.ObjectId, ref: "Plant" },
      plantedAt: { type: Date, default: Date.now },
      plantStatus: {
        type: String,
        enum: ["growing", "ready to harvest", "harvested"],
        default: "growing",
      },
      currentXP: { type: Number, default: 0 },
    },
  ],
  harvestedPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plant" }],
  windowDisplay: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plant" }],
  streakDays: { type: Number, default: 0 },
  totalXP: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
