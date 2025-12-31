const express = require('express');
const router = express.Router();
const foodController = require('../../controllers/user/foodController');

// GET /api/foods
router.get('/', foodController.getAllFoods);

module.exports = router;
