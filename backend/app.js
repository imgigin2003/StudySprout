const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const plantRoutes = require("./routes/plantRoutes");
const gardenRoutes = require("./routes/gardenRoutes");
const displayRoutes = require("./routes/displayRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");

const app = express();

// Origins allowed to call the API. The web app runs on its domain, but the
// packaged native apps make requests from their own webview origins, which the
// backend must also allow — otherwise login/register fail only inside the apps.
const allowedOrigins = [
  "https://studysprout.pages.dev", // production web
  "http://localhost:5173", // Vite dev server
  "tauri://localhost", // Tauri desktop (macOS)
  "http://tauri.localhost", // Tauri desktop (Windows/Linux)
  "https://tauri.localhost",
  "capacitor://localhost", // Capacitor iOS
  "http://localhost", // Capacitor Android
];

app.use(express.json());
app.use(express.static("Public"));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (native HTTP clients, curl) and
      // any origin in the allow-list above.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/plant", plantRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/display", displayRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);
module.exports = app;
