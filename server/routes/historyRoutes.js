const express = require("express");

const router = express.Router();

const db = require("../config/db");

// GET PREDICTION HISTORY

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `
SELECT

p.*,

s.name AS tip_section


FROM predictions p


LEFT JOIN sections s

ON p.section_id=s.id


ORDER BY p.match_date DESC

`,
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
