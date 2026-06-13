const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const plantRoutes = require("./routes/plantRoutes");
const gardenRoutes = require("./routes/gardenRoutes");
const displayRoutes = require("./routes/displayRoutes");

const app = express();

app.use(express.json());
app.use(express.static("Public"));
app.use(cors());

app.use("/api/plant", plantRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/display", displayRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);
module.exports = app;
