const express = require('express');
const router = express.Router();
const foodController = require('../../controllers/admin/foodController');
const adminMiddleware = require('../../middlewares/adminMiddleware');

// GET /admin/foods -> getAllFoods
router.get('/', foodController.getAllFoods);

// POST /admin/foods -> createFood
router.post('/', adminMiddleware, foodController.createFood);

// GET /admin/foods/:id -> getAFood
router.get('/:id', foodController.getAFood);

// PUT /admin/foods/:id -> updateFood
router.put('/:id', adminMiddleware, foodController.updateFood);

// DELETE /admin/foods/:id -> deleteFood
router.delete('/:id', adminMiddleware, foodController.deleteFood);

module.exports = router;