const User = require("../models/User");

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
    const { name, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
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