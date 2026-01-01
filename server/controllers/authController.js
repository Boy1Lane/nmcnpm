const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.json({ message: "Registered", user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } =
        await authService.login(email, password);

      // Save refresh token to httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        // sameSite: "strict",
        sameSite: "lax",      // ⭐ FIX LỖI 403 SAU 15 PHÚT
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async googleLogin(req, res) {
    try {
      const { token } = req.body; // Token from frontend
      const { accessToken, refreshToken, user } = await authService.googleLogin(token);
      
      this.setCookie(res, refreshToken);
      res.json({ accessToken, user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({ message: "Email sent" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.json({ message: "Password reset successful" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token" });

      const newAccess = await authService.refresh(token);
      res.json({ accessToken: newAccess });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id);
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();
