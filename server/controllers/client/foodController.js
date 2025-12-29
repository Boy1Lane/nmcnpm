const { FoodCombo } = require('../../models');

const foodController = {
  // Lấy tất cả combo đang bán
  getAllFoods: async (req, res) => {
    try {
      const foods = await FoodCombo.findAll();
      res.status(200).json(foods);
    } catch (error) {
      console.error("Lỗi lấy danh sách combo:", error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

module.exports = foodController;