const express = require("express");

const router = express.Router();

const { dashboard } = require("../controllers/adminController");

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userAdminController");

const {
  cancelVipSubscription,
  extendVipSubscription,
} = require("../controllers/adminVipController");

const { getVipUsers } = require("../controllers/vipAdminController");

const {
  getPendingManualPayments,
  updateManualPaymentStatus,
} = require("../controllers/manualPaymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Protected admin dashboard route
router.get("/dashboard", protect, adminOnly, dashboard);

// ==============================
// GET ALL USERS
// ==============================

router.get("/users", protect, adminOnly, getAllUsers);

// GET SINGLE USER

router.get("/users/:id", protect, adminOnly, getUserById);

// UPDATE USER ROLE

router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// UPDATE USER ACCOUNT STATUS

router.put("/users/:id/status", protect, adminOnly, updateUserStatus);

// ==============================
// GET ALL VIP USERS
// ==============================

router.get("/vip-users", protect, adminOnly, getVipUsers);

// ==============================
// VIP MANAGEMENT
// ==============================

router.put("/vip-users/:id/cancel", protect, adminOnly, cancelVipSubscription);

router.put("/vip-users/:id/extend", protect, adminOnly, extendVipSubscription);

// ==============================
// MANUAL PAYMENT MANAGEMENT
// ==============================

router.get("/manual-payments", protect, adminOnly, getPendingManualPayments);

router.put(
  "/manual-payments/:id",
  protect,
  adminOnly,
  updateManualPaymentStatus,
);

module.exports = router;
