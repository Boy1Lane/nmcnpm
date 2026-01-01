const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/admin/promotionController');
const adminMiddleware = require('../../middlewares/adminMiddleware');
const staffMiddleware = require('../../middlewares/staffMiddleware');

// GET /admin/promotions -> getAllPromotions
router.get('/', adminMiddleware, promotionController.getAllPromotions);

// POST /admin/promotions -> createPromotion
router.post('/', adminMiddleware, promotionController.createPromotion);

// GET /admin/promotions/:id -> getAPromotion
router.get('/:id', adminMiddleware, promotionController.getAPromotion);

// PUT /admin/promotions/:id -> updatePromotion
router.put('/:id', adminMiddleware, promotionController.updatePromotion);

// DELETE /admin/promotions/:id -> deletePromotion
router.delete('/:id', adminMiddleware, promotionController.deletePromotion);

router.post(
  "/apply",staffMiddleware,
  promotionController.applyPromotion
);


module.exports = router;