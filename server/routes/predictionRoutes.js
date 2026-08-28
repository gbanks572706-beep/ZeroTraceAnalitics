const express = require("express");

const { body, validationResult } = require("express-validator");

const router = express.Router();

// Controllers

const {
  addPrediction,

  getPredictions,

  updatePrediction,

  deletePrediction,

  getFreePredictions,

  getVipPredictions,

  updatePredictionStatus,
} = require("../controllers/predictionController");

// Middleware

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { vipSectionOnly } = require("../middleware/vipSectionMiddleware");

const validatePrediction = [
  body("home_team")
    .trim()
    .notEmpty()
    .withMessage("Home team is required")
    .isLength({ max: 100 })
    .withMessage("Home team must be 100 characters or less"),

  body("away_team")
    .trim()
    .notEmpty()
    .withMessage("Away team is required")
    .isLength({ max: 100 })
    .withMessage("Away team must be 100 characters or less"),

  body("league")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("League must be 100 characters or less"),

  body("prediction_type")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Prediction type must be 100 characters or less"),

  body("prediction")
    .trim()
    .notEmpty()
    .withMessage("Prediction is required")
    .isLength({ max: 255 })
    .withMessage("Prediction must be 255 characters or less"),

  body("odds")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Odds must be a valid positive number"),

  body("confidence")
    .optional({ values: "falsy" })
    .isInt({ min: 0, max: 100 })
    .withMessage("Confidence must be between 0 and 100"),

  body("tip_category")
    .trim()
    .notEmpty()
    .withMessage("Tip category is required")
    .isIn(["FREE", "VIP"])
    .withMessage("Tip category must be FREE or VIP"),

  body("section_id")
    .notEmpty()
    .withMessage("Section ID is required")
    .isInt({ min: 1 })
    .withMessage("Section ID must be a positive integer"),

  body("match_date")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Match date must be a valid date"),
];

const handlePredictionValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

// ==============================
// ADMIN ADD PREDICTION
// ==============================

router.post(
  "/",
  validatePrediction,
  handlePredictionValidationErrors,
  protect,
  adminOnly,
  addPrediction,
);

// ==============================
// GET ALL PREDICTIONS
// ==============================

router.get("/", protect, adminOnly, getPredictions);

// ==============================
// FREE PREDICTIONS
// ==============================

router.get("/free", getFreePredictions);

// ==============================
// VIP PREDICTIONS BY SECTION
// ==============================
//
// Example:
//
// /api/predictions/vip?section=Correct Score VIP
//
//

router.get("/vip/:section_id", protect, vipSectionOnly, getVipPredictions);

// ==============================
// UPDATE FULL PREDICTION
// ==============================

router.put("/:id", protect, adminOnly, updatePrediction);

// ==============================
// UPDATE PREDICTION STATUS
// ==============================

router.put("/:id/status", protect, adminOnly, updatePredictionStatus);

// ==============================
// DELETE PREDICTION
// ==============================

router.delete("/:id", protect, adminOnly, deletePrediction);

module.exports = router;
