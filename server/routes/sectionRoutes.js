const express = require("express");

const router = express.Router();

const {
  getSections,
  getSectionsByCategory,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ==============================
// GET ALL SECTIONS
// ==============================

router.get("/", getSections);

// ==============================
// GET BY CATEGORY
// Example:
// /api/sections/FREE
// /api/sections/VIP
// ==============================

router.get("/:category", getSectionsByCategory);

router.post("/", protect, adminOnly, createSection);

router.put("/:id", protect, adminOnly, updateSection);

router.delete("/:id", protect, adminOnly, deleteSection);

module.exports = router;
