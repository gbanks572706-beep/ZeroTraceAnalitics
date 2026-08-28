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
    ($1, $2, $3, $4, 'GHS', 'pending', 'paystack', $5)

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

module.exports = {
  createPayment,
  getPaymentByReference,
  markPaymentSuccessful,
};
