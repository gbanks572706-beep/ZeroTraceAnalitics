const express = require("express");

const router = express.Router();

const {
  getSubscriptionPlans,

  createSubscriptionPlan,

  updateSubscriptionPlan,

  deleteSubscriptionPlan,
} = require("../controllers/subscriptionPlanController");

const {
  protect,

  adminOnly,
} = require("../middleware/authMiddleware");

// ==============================
// PUBLIC
// ==============================

// Get active subscription plans

router.get("/", getSubscriptionPlans);

// ==============================
// ADMIN ONLY
// ==============================

// Add new plan

router.post("/", protect, adminOnly, createSubscriptionPlan);

// Update plan

router.put("/:id", protect, adminOnly, updateSubscriptionPlan);

// Delete plan

router.delete("/:id", protect, adminOnly, deleteSubscriptionPlan);

module.exports = router;
