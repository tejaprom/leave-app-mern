// server/controllers/authController.js:-
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Token generators
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: generateAccessToken(user), user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // important for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token: accessToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔑 Google Login
const googleLogin = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, password: "google_auth", role: "employee" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: accessToken, user });
  } catch (err) {
    res.status(500).json({ error: "Google login failed" });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Logout (this backend controller route is to clear refreshToken from the cookies)
const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out" });
};

// Protected route (any logged-in user)
const getProfile = (req, res) => {
  res.json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};

// 🔐 Admin-only route
const adminAccess = (req, res) => {
  res.json({ message: "Welcome Admin!" });
};

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // const resetUrl = `http://localhost:5173/reset-password/${token}`;
    // const resetUrl = `https://leave-app-mern-client.onrender.com/reset-password/${token}`;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Replace with your actual email service credentials
    await sendEmail(
      user.email,
      "Password Reset",
      `<p>You requested a password reset</p><p><a href="${resetUrl}">Click here to reset</a></p>`
    );

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  refreshToken,
  logoutUser,
  getProfile,
  adminAccess,
  forgotPassword,
  resetPassword,
};
