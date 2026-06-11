const express = require("express");
const cors = require("cors");
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
// to integrate with react
app.use(cors());

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});

app.listen(PORT, () => {
  console.log("Server running on localhost : 3000");
});
