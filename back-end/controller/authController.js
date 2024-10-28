const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const fs = require("fs");
const path = require("path");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ email, password });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        image: newUser.image,
        color: newUser.color,
        profileSetup: newUser.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User information retrieved successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error during user info retrieval:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add profile image
const addProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imagePath = `/uploads/profiles/${file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { image: imagePath },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: imagePath,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove profile image
const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.image) {
      const imagePath = path.join(__dirname, "../", user.image);
      await fs.promises.unlink(imagePath).catch((err) => {
        console.error("Error deleting image file:", err);
      });
    }

    user.image = null;
    await user.save();

    res.status(200).json({
      message: "Profile image removed successfully",
    });
  } catch (error) {
    console.error("Error removing profile image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, color } = req.body;
    const { userId } = req;

    if (!firstName || !lastName || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  signup,
  login,
  updateProfile,
  userInfo,
  addProfileImage,
  removeProfileImage,
  logout,
};
