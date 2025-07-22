// server/routes/authRoutes:-
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { registerUser, loginUser, googleLogin, refreshToken, logoutUser, forgotPassword, resetPassword, getProfile, adminAccess } = require("../controllers/authController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/admin", protect, authorize("admin"), adminAccess);

module.exports = router;
