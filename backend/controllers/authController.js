const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const newUser = async (req, res, next) => {
  try {
    const { email, password, name, gardenName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ email, password, name, gardenName });
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
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set token and expiry (1 hour) on user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // In a real app, you would send an email here using Nodemailer.
    // For now, we'll return the token in the response so you can test it.
    console.log(`Reset Token for ${email}: ${resetToken}`);

    res.json({
      message: "Reset token generated (Check console for local testing)",
      resetToken, // Remove this in production!
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Must not be expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password (the pre-save hook in User.js will hash it automatically)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
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

module.exports = {
  newUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
};
