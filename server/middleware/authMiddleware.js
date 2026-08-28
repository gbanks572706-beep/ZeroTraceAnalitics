const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Protect routes
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Format:
    // Bearer token_here

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Get current user from database
    const user = await userModel.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
      });
    }

    // Check current account status
    if (user.account_status !== "active") {
      return res.status(403).json({
        message: "Your account is not active",
      });
    }

    // Store user information
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};
