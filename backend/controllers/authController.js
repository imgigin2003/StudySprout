const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const newUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ email, password, name });
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).json({
      message: "User created successfully",
      user: userObject,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
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
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { newUser, loginUser, getUserProfile };
