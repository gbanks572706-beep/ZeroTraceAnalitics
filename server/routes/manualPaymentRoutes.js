const express = require("express");

const router = express.Router();

const {
  submitManualPayment,
  getPendingManualPayments,
  updateManualPaymentStatus,
} = require("../controllers/manualPaymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// =================================
// SUBMIT MANUAL VIP PAYMENT
// =================================

router.post("/", protect, submitManualPayment);

// =================================
// GET PENDING MANUAL PAYMENTS
// ADMIN ONLY
// =================================

router.get("/pending", protect, adminOnly, getPendingManualPayments);

// =================================
// APPROVE / REJECT MANUAL PAYMENT
// ADMIN ONLY
// =================================

router.put("/:id/status", protect, adminOnly, updateManualPaymentStatus);

module.exports = router;
