const express = require("express");

const router = express.Router();

const {
  handlePaystackWebhook,
} = require("../controllers/paystackWebhookController");

// =================================
// PAYSTACK WEBHOOK
// =================================

router.post("/", handlePaystackWebhook);

module.exports = router;
