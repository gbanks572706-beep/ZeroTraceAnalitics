const db = require("../config/db");

// ======================================
// CANCEL VIP SUBSCRIPTION
// ======================================

const cancelVipSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      UPDATE vip_section_subscriptions

      SET status = 'expired'

      WHERE id = $1

      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "VIP subscription not found",
      });
    }

    res.status(200).json({
      message: "VIP subscription cancelled successfully",

      subscription: result.rows[0],
    });
  } catch (error) {
    console.error("CANCEL VIP SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      message: "Unable to cancel VIP subscription. Please try again later.",
    });
  }
};

// ======================================
// EXTEND VIP SUBSCRIPTION
// ======================================

const extendVipSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const { days } = req.body;

    if (!Number.isInteger(days) || days <= 0 || days > 365) {
      return res.status(400).json({
        message: "Extension days must be a whole number between 1 and 365",
      });
    }

    const result = await db.query(
      `
      UPDATE vip_section_subscriptions

      SET expiry_date =
      expiry_date + ($1 || ' days')::interval

      WHERE id=$2

      AND status='active'

      RETURNING *
      `,
      [days, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Active VIP subscription not found",
      });
    }

    res.status(200).json({
      message: "VIP subscription extended successfully",

      subscription: result.rows[0],
    });
  } catch (error) {
    console.error("EXTEND VIP SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      message: "Unable to extend VIP subscription. Please try again later.",
    });
  }
};

module.exports = {
  cancelVipSubscription,

  extendVipSubscription,
};
