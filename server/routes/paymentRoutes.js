const express = require("express");

const router = express.Router();

const { initializePayment } = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// =================================
// INITIALIZE VIP PAYMENT
// =================================

router.post("/initialize", protect, initializePayment);

module.exports = router;
