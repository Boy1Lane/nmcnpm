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
