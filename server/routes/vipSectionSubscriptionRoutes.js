const express = require("express");

const router = express.Router();

const {
  subscribeToVipSection,
  checkVipAccess,
  getMyVipSections,
} = require("../controllers/vipSectionSubscriptionController");

const { protect } = require("../middleware/authMiddleware");

// =================================
// USER SUBSCRIBE TO VIP SECTION
// =================================

// Direct VIP subscription is disabled.
// VIP access must be activated only after
// successful Paystack payment verification.

// =================================
// CHECK ACCESS TO A VIP SECTION
// =================================

router.get("/access/:section_id", protect, checkVipAccess);

// =================================
// GET MY VIP SECTIONS
// =================================

router.get("/my-sections", protect, getMyVipSections);

module.exports = router;
