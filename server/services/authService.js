const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { where, Op } = require("sequelize");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("./emailService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


class AuthService {
  async register(data) {
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
      { expiresIn: "1d" }
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
    await User.update({ refreshToken: null }, { where: { id: userId } });
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email not found");

    // Generate random token
    const token = crypto.randomBytes(20).toString("hex");

    // Set token and expiry (1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Send email
    // Assuming frontend runs on port 5173
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.\n\n` +
      `Vui lòng click vào link sau để đặt lại mật khẩu:\n\n` +
      `${resetUrl}\n\n` +
      `Nếu bạn không yêu cầu, vui lòng bỏ qua email này.`;

    await sendEmail(user.email, "Password Reset Request", message);
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) throw new Error("Token invalid or expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
  }

  async googleLogin(credential) {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    let user = await User.findOne({ where: { email } });

    if (user) {
      // If user exists but no googleId (was registered via email/pass), update it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email,
        fullName: name,
        googleId,
        password: null, // No password for google user
        role: "customer",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
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
}

module.exports = new AuthService();
