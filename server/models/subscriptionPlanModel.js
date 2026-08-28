const db = require("../config/db");

// Get all active subscription plans

const getPlans = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM subscription_plans
    WHERE status = 'active'
    ORDER BY price ASC
    `,
  );

  return result.rows;
};

// Create new subscription plan (Admin)

const createPlan = async (name, price, duration_days, description) => {
  const result = await db.query(
    `
    INSERT INTO subscription_plans
    (
      name,
      price,
      duration_days,
      description
    )

    VALUES
    ($1,$2,$3,$4)

    RETURNING *
    `,
    [name, price, duration_days, description],
  );

  return result.rows[0];
};

// Update subscription plan (Admin)

const updatePlan = async (
  id,
  name,
  price,
  duration_days,
  description,
  status,
) => {
  const result = await db.query(
    `
    UPDATE subscription_plans

    SET
    name=$1,
    price=$2,
    duration_days=$3,
    description=$4,
    status=$5

    WHERE id=$6

    RETURNING *
    `,
    [name, price, duration_days, description, status, id],
  );

  return result.rows[0];
};

// Delete subscription plan (Admin)

const deletePlan = async (id) => {
  const result = await db.query(
    `
    DELETE FROM subscription_plans

    WHERE id=$1

    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  getPlans,

  createPlan,

  updatePlan,

  deletePlan,
};
