const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// If you have auth validators, import them here.
// For now, we'll keep the routes simple.

// ---------- Public Routes ----------

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

// ---------- Protected Routes ----------

router.post("/logout", protect, authController.logout);

router.get("/me", protect, authController.getMe);

router.put("/profile", protect, authController.updateProfile);

router.put("/change-password", protect, authController.changePassword);

module.exports = router;