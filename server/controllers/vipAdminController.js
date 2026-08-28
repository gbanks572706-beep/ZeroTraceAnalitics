const db = require("../config/db");

// ======================================
// GET ALL VIP USERS (ADMIN)
// ======================================

const getVipUsers = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT

      v.id AS subscription_id,

      u.id AS user_id,

      u.name,

      u.email,

      s.name AS section_name,

      v.price_paid,

      v.status,

      v.expiry_date,

      v.created_at


      FROM vip_section_subscriptions v


      JOIN users u

      ON v.user_id = u.id


      JOIN sections s

      ON v.section_id = s.id


      ORDER BY v.created_at DESC

      `,
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET VIP USERS ERROR:", error);

    res.status(500).json({
      message: "Unable to retrieve VIP users. Please try again later.",
    });
  }
};

module.exports = {
  getVipUsers,
};
