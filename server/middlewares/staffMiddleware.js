module.exports = function staffMiddleware(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ message: "Admin or Staff only" });
  }
  next();
}
