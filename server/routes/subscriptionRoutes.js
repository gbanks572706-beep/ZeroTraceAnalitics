const express = require("express");

const router = express.Router();

const { checkSubscription } = require("../controllers/subscriptionController");

const { protect } = require("../middleware/authMiddleware");

// Check Active Subscription

router.get("/check", protect, checkSubscription);

module.exports = router;
