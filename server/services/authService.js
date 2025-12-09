const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { where } = require("sequelize");

class AuthService {
  async register(data) {
    console.log("Registering user:", data);
    const userExists = await User.findOne({ where: { email: data.email } });
    if (userExists) throw new Error("Email already used");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Wrong password");

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, user };
  }

  async refresh(oldToken) {
    const user = await User.findOne({ where: { refreshToken: oldToken } });
    if (!user) throw new Error("Invalid refresh token");

    const decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccess = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return newAccess;
  }

  async logout(userId) {
    await User.update({ refreshToken: null }, {where: { id: userId } });
  }
}

module.exports = new AuthService();
