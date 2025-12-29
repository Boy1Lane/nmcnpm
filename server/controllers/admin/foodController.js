const FoodCombo = require('../../models/FoodCombo');
const cloudinary = require('../../config/cloudinary');

const uploadBufferToCloudinary = (buffer, options = {}) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: options.folder || 'foods',
      resource_type: 'image'
    },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  stream.end(buffer);
});

const getUploadedImageFile = (req) => {
  if (req.file) return req.file;
  if (req.files?.picture?.[0]) return req.files.picture[0];
  if (req.files?.image?.[0]) return req.files.image[0];
  return null;
};

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
    const { name, price, items, pictureUrl } = req.body;
    if (!name || !price || !items) {
      return res.status(400).json({ message: 'Missing value (name, price, items)!' });
    }

    let resolvedPictureUrl = pictureUrl;
    const file = getUploadedImageFile(req);
    if (file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(file.buffer, { folder: 'foods/combos' });
      resolvedPictureUrl = uploaded.secure_url;
    }

    const newFoodCombo = await FoodCombo.create({
      name,
      price,
      items,
      pictureUrl: resolvedPictureUrl
    });
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
    const { name, price, items, pictureUrl } = req.body;
    const foodCombo = await FoodCombo.findByPk(id); 
    if (!foodCombo) {
        return res.status(404).json({ message: 'Food combo not found' });
    }

    let resolvedPictureUrl = pictureUrl;
    const file = getUploadedImageFile(req);
    if (file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(file.buffer, { folder: 'foods/combos' });
      resolvedPictureUrl = uploaded.secure_url;
    }

    if (name !== undefined) foodCombo.name = name;
    if (price !== undefined) foodCombo.price = price;
    if (items !== undefined) foodCombo.items = items;
    if (resolvedPictureUrl !== undefined) foodCombo.pictureUrl = resolvedPictureUrl;
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
