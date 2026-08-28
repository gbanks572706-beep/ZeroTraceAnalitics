const express = require("express");

const router = express.Router();

const {
  getVipPlans,
  createVipPlan,
  updateVipPlan,
  deleteVipPlan,
} = require("../controllers/vipSectionPlanController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ==============================
// GET ALL VIP PLANS
// ==============================

router.get("/", getVipPlans);

// ==============================
// CREATE VIP PLAN (ADMIN)
// ==============================

router.post("/", protect, adminOnly, createVipPlan);

// ==============================
// UPDATE VIP PLAN (ADMIN)
// ==============================

router.put("/:id", protect, adminOnly, updateVipPlan);

// ==============================
// DELETE VIP PLAN (ADMIN)
// ==============================

router.delete("/:id", protect, adminOnly, deleteVipPlan);

module.exports = router;
