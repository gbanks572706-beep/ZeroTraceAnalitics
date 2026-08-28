const db = require("../config/db");

// =================================
// CHECK ACTIVE SUBSCRIPTION (OLD SYSTEM)
// =================================

const getActiveSubscription = async (user_id) => {
  const result = await db.query(
    `
    SELECT *
    FROM subscriptions
    WHERE user_id = $1
    AND status = 'active'
    AND expiry_date > CURRENT_TIMESTAMP
    ORDER BY id DESC
    LIMIT 1
    `,
    [user_id],
  );

  return result.rows[0];
};

// =================================
// CHECK ACCESS TO ONE VIP SECTION
// =================================

const getActiveVipSection = async (user_id, section_id) => {
  const result = await db.query(
    `
    SELECT *
    FROM vip_section_subscriptions

    WHERE user_id = $1

    AND section_id = $2

    AND status = 'active'

    AND expiry_date > CURRENT_TIMESTAMP

    LIMIT 1
    `,
    [user_id, section_id],
  );

  return result.rows[0];
};

// =================================
// GET ALL USER VIP SECTIONS
// =================================

const getUserVipSections = async (user_id) => {
  const result = await db.query(
    `
    SELECT

    s.id,
    s.name,
    s.category,
    v.status,
    v.expiry_date

    FROM vip_section_subscriptions v


    JOIN sections s

    ON v.section_id = s.id


    WHERE v.user_id = $1

    AND v.status = 'active'

    AND v.expiry_date > CURRENT_TIMESTAMP


    ORDER BY v.id DESC

    `,
    [user_id],
  );

  return result.rows;
};

module.exports = {
  getActiveSubscription,

  getActiveVipSection,

  getUserVipSections,
};
