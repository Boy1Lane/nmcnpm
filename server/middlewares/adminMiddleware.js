module.exports = function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    console.log(req.user.role);
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
