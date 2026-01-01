const Promotion = require('../../models/Promotion');
const { Op } = require("sequelize");
const sequelize = require('../../config/db');

// GET /admin/promotions -> getAllPromotions    
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.status(200).json(promotions);
    } catch (error) {
    res.status(500).json({ message: 'getAllPromotions error' });
  }
};

// POST /admin/promotions -> createPromotion
exports.createPromotion = async (req, res) => {
    try {
    const { code, description, discountPercentage, validFrom, validTo, usageLimit } = req.body;
    const newPromotion = await Promotion.create({
      code,
      description,
      discountPercentage,
      validFrom,
      validTo,
      usageLimit
    });
    res.status(201).json(newPromotion);
  } catch (error) {
    res.status(500).json({ message: 'createPromotion error' });
  }
};

// GET /admin/promotions/:id -> getAPromotion
exports.getAPromotion = async (req, res) => {
    try {
    const { id } = req.params;
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }   
    res.status(200).json(promotion);
    } catch (error) {
    res.status(500).json({ message: 'getAPromotion error' });
    }
};

// PUT /admin/promotions/:id -> updatePromotion
exports.updatePromotion = async (req, res) => {
    try {
    const { id } = req.params;
    const { code, description, discountPercentage, validFrom, validTo, usageLimit } = req.body;
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    promotion.code = code || promotion.code;
    promotion.description = description || promotion.description;
    promotion.discountPercentage = discountPercentage || promotion.discountPercentage;
    promotion.validFrom = validFrom || promotion.validFrom;
    promotion.validTo = validTo || promotion.validTo;
    promotion.usageLimit = usageLimit || promotion.usageLimit;
    await promotion.save();
    res.status(200).json(promotion);
    } catch (error) {
    res.status(500).json({ message: 'updatePromotion error' });
  }
};

// DELETE /admin/promotions/:id -> deletePromotion
exports.deletePromotion = async (req, res) => {
    try {
    const { id } = req.params;
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
        return res.status(404).json({ message: 'Promotion not found' });
    }
    await promotion.destroy();
    res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
    res.status(500).json({ message: 'deletePromotion error' });
  }
};
// POST /admin/promotions/apply
exports.applyPromotion = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    // Validate code
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return res.status(400).json({ message: 'Promotion code is required' });
    }

    // Validate totalAmount (allow zero)
    if (totalAmount === null || totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) < 0) {
      return res.status(400).json({ message: 'totalAmount must be a non-negative number' });
    }

    const now = new Date();

    // Case-insensitive code match (works with Postgres via LOWER)
    const promotion = await Promotion.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('code')),
        code.toLowerCase()
      ),
    });

    // If not found by code, return not found
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not valid' });
    }

    // Validate date window
    if (promotion.validFrom > now || promotion.validTo < now) {
      return res.status(400).json({ message: 'Promotion is not active' });
    }

    // check usage limit (null => unlimited)
    if (promotion.usageLimit !== null && promotion.timesUsed >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Promotion usage limit reached' });
    }

    const discountAmount = Math.floor((Number(totalAmount) * promotion.discountPercentage) / 100);

    // Do NOT modify promotion record here; this endpoint only validates and calculates discount.
    return res.status(200).json({
      promotionId: promotion.id,
      discountPercentage: promotion.discountPercentage,
      discountAmount,
    });
  } catch (error) {
    console.error('applyPromotion error:', error);
    res.status(500).json({ message: 'Apply promotion error' });
  }
};
