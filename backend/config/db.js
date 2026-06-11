const mongoose = require("mongoose");
const url = "mongodb://localhost:27017";

async function connectDB() {
  try {
    await mongoose.connect(url, {
      dbName: "StudySproutDB",
    });
    console.log("Connected to MongoDB: ", mongoose.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
