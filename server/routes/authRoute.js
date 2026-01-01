const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /auth/register -> register
router.post("/register", authController.register);
// POST /auth/login -> login
router.post("/login", authController.login);
// POST /auth/refresh -> refresh token
router.post("/refresh", authController.refresh);
// POST /auth/logout -> logout
router.post("/logout", authMiddleware, authController.logout);

// GET /auth/me -> get profile
router.get("/me", authMiddleware, authController.getProfile);

// POST /auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// POST /auth/reset-password
router.post("/reset-password", authController.resetPassword);

// POST /auth/google-login
router.post("/google-login", authController.googleLogin);

module.exports = router;