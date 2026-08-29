const express = require("express");

const router = express.Router();

const {
  submitManualPayment,
} = require("../controllers/manualPaymentController");

const { protect } = require("../middleware/authMiddleware");

// =================================
// SUBMIT MANUAL VIP PAYMENT
// =================================

router.post("/", protect, submitManualPayment);

module.exports = router;
