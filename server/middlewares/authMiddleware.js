const jwt = require("jsonwebtoken");


// Authentication Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch { 
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;