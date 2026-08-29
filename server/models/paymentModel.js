const db = require("../config/db");

// =================================
// CREATE PENDING PAYMENT
// =================================

const createPayment = async (
  user_id,
  plan_id,
  reference,
  amount,
  gateway_response,
) => {
  const result = await db.query(
    `
    INSERT INTO payments
    (
      user_id,
      plan_id,
      reference,
      amount,
      currency,
      status,
      payment_gateway,
      gateway_response
    )

    VALUES
($1, $2, $3, $4, 'GHS', 'pending', 'manual', $5)

    RETURNING *
    `,
    [user_id, plan_id, reference, amount, gateway_response],
  );

  return result.rows[0];
};

// =================================
// FIND PAYMENT BY REFERENCE
// =================================

const getPaymentByReference = async (reference) => {
  const result = await db.query(
    `
    SELECT *
    FROM payments
    WHERE reference = $1
    LIMIT 1
    `,
    [reference],
  );

  return result.rows[0];
};

// =================================
// MARK PAYMENT AS SUCCESSFUL
// =================================

const markPaymentSuccessful = async (reference, gateway_response) => {
  const result = await db.query(
    `
    UPDATE payments

    SET
      status = 'success',
      paid_at = CURRENT_TIMESTAMP,
      gateway_response = $1

    WHERE reference = $2
AND status = 'pending'

RETURNING *
    `,
    [gateway_response, reference],
  );

  return result.rows[0];
};

// =================================
// GET PENDING MANUAL PAYMENTS
// =================================

const getPendingManualPayments = async () => {
  const result = await db.query(
    `
    SELECT
      p.id,
      p.user_id,
      p.plan_id,
      p.reference,
      p.amount,
      p.currency,
      p.status,
      p.payment_gateway,
      p.gateway_response,
      p.created_at,

      u.name AS user_name,
      u.email AS user_email,

      v.section_id,
      s.name AS section_name,
      v.plan_name,
      v.duration_days

    FROM payments p

    JOIN users u
      ON p.user_id = u.id

    JOIN vip_section_plans v
      ON p.plan_id = v.id

    JOIN sections s
      ON v.section_id = s.id

    WHERE p.status = 'pending'
      AND p.payment_gateway = 'manual'

    ORDER BY p.created_at DESC
    `,
  );

  return result.rows;
};

// =================================
// UPDATE PAYMENT STATUS
// =================================

const updatePaymentStatus = async (
  paymentId,
  status,
  gatewayResponse = null,
) => {
  const result = await db.query(
    `
    UPDATE payments

    SET
      status = $1,
      paid_at = CASE
        WHEN $1 = 'success'
        THEN CURRENT_TIMESTAMP
        ELSE paid_at
      END,
      gateway_response = COALESCE($2, gateway_response)

    WHERE id = $3

    RETURNING *
    `,
    [status, gatewayResponse, paymentId],
  );

  return result.rows[0];
};

// =================================
// EXPORT
// =================================

module.exports = {
  createPayment,
  getPaymentByReference,
  markPaymentSuccessful,
  getPendingManualPayments,
  updatePaymentStatus,
};
