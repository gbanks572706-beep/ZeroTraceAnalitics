const paymentModel = require("../models/paymentModel");
const vipSectionPlanModel = require("../models/vipSectionPlanModel");

// =================================
// SUBMIT MANUAL VIP PAYMENT
// =================================

const submitManualPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const { plan_id, payment_name, reference, notes } = req.body;

    // =================================
    // VALIDATION
    // =================================

    if (!plan_id || !payment_name || !reference) {
      return res.status(400).json({
        message: "Plan, payment name and reference are required",
      });
    }

    // =================================
    // CHECK VIP PLAN
    // =================================

    const plan = await vipSectionPlanModel.getPlanById(plan_id);

    if (!plan) {
      return res.status(404).json({
        message: "VIP plan not found",
      });
    }

    // =================================
    // PREVENT DUPLICATE REFERENCE
    // =================================

    const existingPayment = await paymentModel.getPaymentByReference(reference);

    if (existingPayment) {
      return res.status(409).json({
        message: "This payment reference has already been submitted",
      });
    }

    // =================================
    // CREATE PAYMENT RECORD
    // =================================

    const gatewayResponse = {
      method: "manual",
      payment_name,
      notes: notes || "",
      submitted_by_user: userId,
    };

    const payment = await paymentModel.createPayment(
      userId,
      plan_id,
      reference,
      plan.price,
      gatewayResponse,
    );

    // =================================
    // SUCCESS
    // =================================

    return res.status(201).json({
      message:
        "Manual payment submitted successfully. Waiting for admin verification.",
      payment,
    });
  } catch (error) {
    console.error("MANUAL PAYMENT ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to submit manual payment",
    });
  }
};

module.exports = {
  submitManualPayment,
};
