// server/services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthService {
  async register(data) {
    const userExists = await User.findOne({ where: { email: data.email } });
    if (userExists) throw new Error("Email này đã được sử dụng!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: 'customer'
    });
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email không tồn tại!");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Mật khẩu không đúng!");

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET || "access_key_tam_thoi",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || "refresh_key_tam_thoi",
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, user };
  }

  async refresh(oldToken) {
    if (!oldToken) throw new Error("Không tìm thấy Refresh Token");
    const user = await User.findOne({ where: { refreshToken: oldToken } });
    if (!user) throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
    try {
        jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET || "refresh_key_tam_thoi");
    } catch (err) {
        throw new Error("Refresh token hết hạn/không hợp lệ");
    }
    const newAccess = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET || "access_key_tam_thoi",
      { expiresIn: "15m" }
    );
    return newAccess;
  }

  async logout(userId) {
    await User.update({ refreshToken: null }, { where: { id: userId } });
  }
}

module.exports = new AuthService();