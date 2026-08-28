const express = require("express");
const rateLimit = require("express-rate-limit");

const { body, validationResult } = require("express-validator");

const router = express.Router();

const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or less"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage("Email must be 150 characters or less"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters"),
];

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

const { registerUser, loginUser } = require("../controllers/authController");

// Register route
router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  registerUser,
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  loginLimiter,
  loginUser,
);

module.exports = router;
