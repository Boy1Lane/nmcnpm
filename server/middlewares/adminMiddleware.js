module.exports = function adminMiddleware(req, res, next) {
   console.log(
    "👑 adminMiddleware chạy:",
    req.method,
    req.originalUrl,
    "| user:",
    req.user
  );
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
