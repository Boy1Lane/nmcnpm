const User = require("../../models/User");
const bcrypt = require("bcrypt"); // ✅ THÊM

// GET /admin/users -> getAllUsers
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'getAllUsers error' });
  }
};

// GET /admin/users/:id -> getAUser 
exports.getAUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ message: 'getAUser error' });
  }
};

// PUT /admin/users/:id -> updateUser
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role,phone } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone=phone||user.phone;
    await user.save();
    res.status(200).json({ 
        message: 'User updated successfully', user 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateUser error' });
  }
};

// DELETE /admin/users/:id -> deleteUser
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'deleteUser error' });
  } 
};

// POST /admin/users -> createUser
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role,phone } = req.body;
    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ fullName, email, password:hashedPassword, role,phone });
    res.status(201).json({ 
        message: 'User created successfully!',
        data: newUser 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};