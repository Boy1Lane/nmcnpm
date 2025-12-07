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

module.exports = router;