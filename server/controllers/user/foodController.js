const FoodCombo = require('../../models/FoodCombo');

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await FoodCombo.findAll();
    res.status(200).json(foods);
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
