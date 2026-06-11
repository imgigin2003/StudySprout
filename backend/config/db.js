const mongoose = require("mongoose");
const express = require("express");

const app = express();
const url = "mongodb://localhost:27017";

mongoose
  .connect(url, {
    dbName: "StudySproutDB",
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Connected to Database. server running on localhost : 3000");
    });
  })
  .catch((err) => {
    console.error("Connection Error. ", err);
  });
