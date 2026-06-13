const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const newUser = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  try {
    const user = await User.create({ email, password, name });
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).json({
      message: "User created successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Couldn't create user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "Login successful, Your Token:", token });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed ", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user profile", error: error.message });
  }
};

module.exports = { newUser, loginUser, getUserProfile };
