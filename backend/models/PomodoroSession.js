const mongoose = require("mongoose");

const PomodoroSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    timeDuration: {
      type: Number,
      required: true,
      enum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    },
    sessionCompleted: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "canceled"],
      default: "active",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timeStamps: true },
);

const pmdSession = mongoose.model("PomodoroSession", PomodoroSessionSchema);
module.exports = pmdSession;
