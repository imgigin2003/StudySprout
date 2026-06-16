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
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  streakDays: { type: Number, default: 0 },
  totalXP: { type: Number, default: 0 },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
