const Promotion = require('../../models/Promotion');

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