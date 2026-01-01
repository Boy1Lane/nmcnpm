const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboardController");

// GET /admin/dashboard/today
router.get("/today", dashboardController.getTodayBookingStats);

module.exports = router;
