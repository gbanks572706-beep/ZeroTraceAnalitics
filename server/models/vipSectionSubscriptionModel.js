const db = require("../config/db");

// ======================================
// GET VIP PLAN BY ID
// ======================================

const getPlanById = async (plan_id) => {
  const result = await db.query(
    `
    SELECT *

    FROM vip_section_plans

    WHERE id=$1

    AND status='active'

    LIMIT 1
    `,
    [plan_id],
  );

  return result.rows[0];
};

// ======================================
// GET VIP PLAN BY SECTION ID
// ======================================

const getPlanBySectionId = async (section_id) => {
  const result = await db.query(
    `
    SELECT *

    FROM vip_section_plans

    WHERE section_id=$1

    AND status='active'

    LIMIT 1
    `,
    [section_id],
  );

  return result.rows[0];
};

// ======================================
// CREATE VIP SECTION SUBSCRIPTION
// ======================================

const createSubscription = async (
  user_id,
  section_id,
  price_paid,
  expiry_date,
) => {
  const result = await db.query(
    `
    INSERT INTO vip_section_subscriptions
    (
      user_id,
      section_id,
      price_paid,
      expiry_date,
      status
    )

    VALUES($1,$2,$3,$4,'active')

    RETURNING *
    `,
    [user_id, section_id, price_paid, expiry_date],
  );

  return result.rows[0];
};

// ======================================
// CHECK EXISTING ACTIVE SUBSCRIPTION
// ======================================

const checkExistingSubscription = async (user_id, section_id) => {
  // update expired subscriptions first
  await expireOldSubscriptions();

  const result = await db.query(
    `
    SELECT *

    FROM vip_section_subscriptions

    WHERE user_id = $1

    AND section_id = $2

    AND status = 'active'

    AND expiry_date > CURRENT_TIMESTAMP

    ORDER BY id DESC

    LIMIT 1

    `,
    [user_id, section_id],
  );

  return result.rows[0];
};

// ======================================
// EXPIRE OLD SUBSCRIPTIONS
// ======================================

const expireOldSubscriptions = async () => {
  await db.query(
    `
    UPDATE vip_section_subscriptions

    SET status = 'expired'

    WHERE status = 'active'

    AND expiry_date <= CURRENT_TIMESTAMP
    `,
  );
};

// ======================================
// CHECK USER ACCESS TO VIP SECTION
// ======================================

const checkAccess = async (user_id, section_id) => {
  await expireOldSubscriptions();

  const result = await db.query(
    `
    SELECT *

    FROM vip_section_subscriptions

    WHERE user_id=$1

    AND section_id=$2

    AND status='active'

    AND expiry_date > CURRENT_TIMESTAMP

    ORDER BY id DESC

    LIMIT 1

    `,
    [user_id, section_id],
  );

  return result.rows[0];
};

// ======================================
// GET USER VIP SECTIONS
// ======================================

const getUserVipSections = async (user_id) => {
  const result = await db.query(
    `
    SELECT DISTINCT ON (s.id)

s.id,
s.name,
s.category,
v.id AS subscription_id,
v.price_paid,
v.expiry_date,
v.status,
v.created_at

    FROM vip_section_subscriptions v


    JOIN sections s

    ON v.section_id=s.id


    WHERE v.user_id=$1


    AND v.status='active'


    AND v.expiry_date > CURRENT_TIMESTAMP


    ORDER BY s.id, v.created_at DESC

    `,
    [user_id],
  );

  return result.rows;
};

module.exports = {
  getPlanById,

  getPlanBySectionId,

  createSubscription,

  checkExistingSubscription,

  expireOldSubscriptions,

  checkAccess,

  getUserVipSections,
};
