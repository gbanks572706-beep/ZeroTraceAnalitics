const express = require("express");

const router = express.Router();

const {
  verifyPayment,
} = require("../controllers/paymentVerificationController");

const { protect } = require("../middleware/authMiddleware");

// =================================
// VERIFY PAYSTACK PAYMENT
// =================================

router.post("/verify", protect, verifyPayment);

module.exports = router;
