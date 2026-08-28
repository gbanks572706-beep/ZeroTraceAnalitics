const db = require("../config/db");

// =================================
// GET USER DASHBOARD DATA
// =================================

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // ==============================
    // GET USER INFORMATION
    // ==============================

    const userResult = await db.query(
      `
SELECT
    u.id,
    u.name,
    u.email,
    u.role
FROM users u
WHERE u.id = $1
`,

      [userId],
    );

    const user = userResult.rows[0];

    // ==============================
    // GET VIP SECTIONS
    // ==============================

    const vipResult = await db.query(
      `
SELECT

    s.id,
    s.name,
    s.category,
    s.status,
    v.expiry_date

FROM vip_section_subscriptions v

JOIN sections s

ON v.section_id = s.id


WHERE v.user_id = $1

AND v.status = 'active'

AND v.expiry_date > CURRENT_TIMESTAMP


ORDER BY v.id DESC

`,

      [userId],
    );

    // ==============================
    // GET PREDICTIONS
    // ==============================

    const hasVIP = vipResult.rows.length > 0;

    let predictionResult;

    if (hasVIP) {
      predictionResult = await db.query(
        `
    SELECT p.*

    FROM predictions p

    JOIN vip_section_subscriptions v

    ON p.section_id = v.section_id


    WHERE v.user_id = $1

    AND v.status = 'active'

    AND v.expiry_date > CURRENT_TIMESTAMP

    AND p.tip_category = 'VIP'


    ORDER BY p.created_at DESC

    `,
        [userId],
      );
    } else {
      predictionResult = await db.query(
        `
    SELECT *

    FROM predictions

    WHERE tip_category = 'FREE'

    ORDER BY created_at DESC

    `,
      );
    }

    res.status(200).json({
      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        vip_status: hasVIP ? "active" : "inactive",

        vip_sections: vipResult.rows,
      },

      predictions: predictionResult.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};
