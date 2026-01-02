const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/user/promotionController');

// GET /api/promotions
router.get('/', promotionController.getAllPromotions);

// POST /api/promotions/check
router.post('/check', promotionController.checkPromotion);

module.exports = router;
