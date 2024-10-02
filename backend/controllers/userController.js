import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import {
  verifyPassword,
  generateToken,
  hashPassword,
} from "../services/authService.js";

// POST /api/login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username,
  });
  if (user && (await verifyPassword(password, user.password))) {
    generateToken(res, user._id, user);
    res.json({
      userId: user._id,
      name: user.name,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password." });
  }
});

// POST /api/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, role, email, contact, secretCode } =
    req.body;
  if (!secretCode || secretCode !== process.env.REGISTER_SECRET) {
    res
      .status(400)
      .json({ message: "Invalid Registration code. Please contact admin." });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "Already registered. Please login." });
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    username,
    password: passwordHash,
    role,
    email,
    contact,
  });

  if (user) {
    generateToken(res, user._id, user);
    res.status(201).json({
      userId: user._id,
      name: user.name,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// POST /api/logout
const logoutUser = (req, res) => {
  let token = req.cookies.auth;
  if (token) {
    res.clearCookie("auth");
    res.status(200).json({ message: "Logout successful." });
  } else {
    res.status(200).json({ message: "Already Logged out!" });
  }
};

// GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      userId: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      contact: user.contact,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.contact = req.body.contact || user.contact;

    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
