const Promotion = require('../../models/Promotion');
const { Op } = require('sequelize');

exports.getAllPromotions = async (req, res) => {
  try {
    const currentDate = new Date();
    const promotions = await Promotion.findAll({
      where: {
        validFrom: { [Op.lte]: currentDate },
        validTo: { [Op.gte]: currentDate }
      }
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkPromotion = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Vui lòng nhập mã khuyến mãi' });
    }

    const promotion = await Promotion.findOne({
      where: { code }
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Mã khuyến mãi không tồn tại' });
    }

    const currentDate = new Date();
    // Check dates
    if (promotion.validFrom > currentDate) {
      return res.status(400).json({ message: 'Mã khuyến mãi chưa có hiệu lực' });
    }
    if (promotion.validTo < currentDate) {
      return res.status(400).json({ message: 'Mã khuyến mãi đã hết hạn' });
    }

    // Check usage limit
    if (promotion.usageLimit !== null && promotion.timesUsed >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Mã khuyến mãi đã hết lượt sử dụng' });
    }

    // Return active promotion info
    res.status(200).json({
      success: true,
      data: {
        id: promotion.id,
        code: promotion.code,
        discountPercentage: promotion.discountPercentage,
        description: promotion.description
      }
    });

  } catch (error) {
    console.error('Check promotion error:', error);
    res.status(500).json({ message: 'Lỗi kiểm tra mã khuyến mãi' });
  }
};
