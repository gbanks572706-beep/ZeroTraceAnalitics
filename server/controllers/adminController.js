const db = require("../config/db");

// Admin Dashboard Data

const dashboard = async (req, res) => {
  try {
    const users = await db.query(
      `
SELECT COUNT(*) 
FROM users
`,
    );

    const vipUsers = await db.query(
      `
SELECT COUNT(DISTINCT user_id)
FROM vip_section_subscriptions

WHERE status = 'active'

AND expiry_date > CURRENT_TIMESTAMP
`,
    );

    const predictions = await db.query(
      `
SELECT COUNT(*)
FROM predictions
`,
    );

    res.status(200).json({
      message: "Welcome to ZeroTraceAnalytics Admin Dashboard",

      admin: req.user.email,

      role: req.user.role,

      stats: {
        totalUsers: users.rows[0].count,

        vipMembers: vipUsers.rows[0].count,

        totalPredictions: predictions.rows[0].count,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  dashboard,
};
