// Vercel serverless entry point.
//
// Every incoming request is routed here (see ../vercel.json). We ensure the
// MongoDB connection is ready (cached across warm invocations), then delegate
// to the existing Express app, which handles the real /api/* routes.
const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Database connection failed" }));
    return;
  }
  return app(req, res);
};
