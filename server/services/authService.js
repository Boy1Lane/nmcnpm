const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('./emailService');
const { Op } = require("sequelize");

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

    return this.generateTokens(user);
  }

  async googleLogin(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        googleId,
        role: 'customer'
      });
    } else if (!user.googleId) {
      // Link Google ID if user exists but hasn't linked yet
      user.googleId = googleId;
      await user.save();
    }

    return this.generateTokens(user);
  }

  async generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
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
  
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;  // + 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetUrl}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, 'Cinema-Verse Password Reset Request', message);
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Check if not expired
      }
    });

    if (!user) throw new Error("Password reset token is invalid or has expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return user;
  }
}

module.exports = new AuthService();
