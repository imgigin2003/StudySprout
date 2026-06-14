const PomodoroSession = require("../models/PomodoroSession");
const User = require("../models/User");

const startSession = async (req, res, next) => {
  try {
    const { plotId, timeDuration } = req.body;
    if (!plotId || !timeDuration) {
      return res.status(403).json({ message: "Invalid Plot ID." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "User Unauthorized." });
    }
    const sessionDetail = await PomodoroSession.create({
      user: req.user.id,
      plotId,
      timeDuration,
    });
    res.status(201).json({ message: "Session Started.", sessionDetail });
  } catch (error) {
    next(error);
  }
};

const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await PomodoroSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }
    session.sessionCompleted += 1;
    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(session.plotId);
    plot.currentXP += session.timeDuration;
    user.totalXP += session.timeDuration;
    if (plot.currentXP >= plot.plant.xpValue) {
      plot.plantStatus = "ready to harvest";
    }
    await session.save();
    await user.save();
    res
      .status(201)
      .json({ message: "Completed a session.", session, user: user.totalXP });
  } catch (error) {
    next(error);
  }
};

const stopSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(404).json({ message: "Session not found." });
    }
    const session = await PomodoroSession.findById(sessionId);
    let diff = Date.now() - session.startTime;
    sessionInMin = Math.floor(diff / (1000 * 60));
    if (sessionInMin > session.timeDuration) {
      return res.status(500).json({ message: "Invalid Session Details." });
    }
    if (sessionInMin === 0) {
      session.status = "canceled";
      await session.save();
      return res
        .status(200)
        .json({ message: "Session canceled. No XP gained." });
    }

    const user = await User.findById(req.user.id).populate("garden.plant");
    const plot = user.garden.id(session.plotId);
    if (plot.currentXP >= plot.plant.xpValue) {
      plot.plantStatus = "ready to harvest";
    }
    plot.currentXP += sessionInMin;
    user.totalXP += sessionInMin;
    session.status = "canceled";
    await session.save();
    await user.save();
    res.status(200).json({ message: "Session stopped early." });
  } catch (error) {
    next(error);
  }
};

module.exports = { startSession, completeSession, stopSession };
