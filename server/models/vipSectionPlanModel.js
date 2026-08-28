const db = require("../config/db");

// ==============================
// GET ALL VIP SECTION PLANS
// ==============================

const getPlans = async () => {
  const result = await db.query(
    `
SELECT

v.id,

v.section_id,

s.name AS section_name,

v.plan_name,

v.price,

v.duration_days,

v.description,

v.features,

v.is_featured,

v.status,

v.created_at


FROM vip_section_plans v


JOIN sections s

ON v.section_id = s.id


ORDER BY v.id DESC

`,
  );

  return result.rows;
};

// ==============================
// GET VIP PLAN BY ID
// ==============================

const getPlanById = async (id) => {
  const result = await db.query(
    `
    SELECT *

    FROM vip_section_plans

    WHERE id=$1

    AND status='active'

    LIMIT 1
    `,
    [id],
  );

  return result.rows[0];
};

// ==============================
// CREATE VIP SECTION PLAN
// ==============================

const createPlan = async (
  section_id,
  plan_name,
  price,
  duration_days,
  description,
  features,
  is_featured,
  status,
) => {
  const result = await db.query(
    `
INSERT INTO vip_section_plans

(
section_id,
plan_name,
price,
duration_days,
description,
features,
is_featured,
status
)

VALUES($1,$2,$3,$4,$5,$6,$7,$8)

RETURNING *

`,

    [
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
    ],
  );

  return result.rows[0];
};

// ==============================
// UPDATE VIP SECTION PLAN
// ==============================

const updatePlan = async (
  id,
  section_id,
  plan_name,
  price,
  duration_days,
  description,
  features,
  is_featured,
  status,
) => {
  const result = await db.query(
    `
    UPDATE vip_section_plans

    SET
      section_id=$1,
      plan_name=$2,
      price=$3,
      duration_days=$4,
      description=$5,
      features=$6,
      is_featured=$7,
      status=$8,
      updated_at=CURRENT_TIMESTAMP

    WHERE id=$9

    RETURNING *
    `,
    [
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
      id,
    ],
  );

  return result.rows[0];
};

// ==============================
// DELETE VIP SECTION PLAN
// ==============================

const deletePlan = async (id) => {
  const result = await db.query(
    `
    DELETE FROM vip_section_plans

    WHERE id=$1

    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  getPlans,

  getPlanById,

  createPlan,

  updatePlan,

  deletePlan,
};
