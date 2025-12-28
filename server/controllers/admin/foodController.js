const FoodCombo = require('../../models/FoodCombo');

// GET /admin/foods -> getAllFoodCombos
exports.getAllFoods = async (req, res) => {
  try {
    const foodCombos = await FoodCombo.findAll();
    res.status(200).json(foodCombos);
  } catch (error) {
    res.status(500).json({ message: 'getAllFoods error' });
  } 
};

// POST /admin/foods -> createFoodCombo
exports.createFood = async (req, res) => {
  try {
    const { name, price, items } = req.body;
    if (!name || !price || !items) {
      return res.status(400).json({ message: 'Missing value (name, price, items)!' });
    }
    const newFoodCombo = await FoodCombo.create({ name, price, items });
    res.status(201).json({
      message: 'Food combo created successfully!',
      data: newFoodCombo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

// GET /admin/foods/:id -> getAFoodCombo
exports.getAFood = async (req, res) => {
    try {
    const { id } = req.params;
    const foodCombo = await FoodCombo.findByPk(id);
    if (!foodCombo) {
      return res.status(404).json({ message: 'Food combo not found' });
    }   
    res.status(200).json(foodCombo);
    } catch (error) {
    res.status(500).json({ message: 'getAFood error' });
    }
};

// PUT /admin/foods/:id -> updateFoodCombo
exports.updateFood = async (req, res) => {
    try {
    const { id } = req.params;
    const { name, price, items } = req.body;
    const foodCombo = await FoodCombo.findByPk(id); 
    if (!foodCombo) {
        return res.status(404).json({ message: 'Food combo not found' });
    }
    foodCombo.name = name || foodCombo.name;
    foodCombo.price = price || foodCombo.price;
    foodCombo.items = items || foodCombo.items;
    await foodCombo.save();
    res.status(200).json({ 
        message: 'Food combo updated successfully', foodCombo 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateFood error', error: error.message });
  }
};

// DELETE /admin/foods/:id -> deleteFoodCombo
exports.deleteFood = async (req, res) => {
    try {
    const { id } = req.params;
    const foodCombo = await FoodCombo.findByPk(id);
    if (!foodCombo) {
      return res.status(404).json({ message: 'Food combo not found' });
    }
    await foodCombo.destroy();
    res.status(200).json({ message: 'Food combo deleted successfully' });
    } catch (error) {
    res.status(500).json({ message: 'deleteFood error' });
  }
};
