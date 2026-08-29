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

// =================================
// GET PENDING MANUAL PAYMENTS
// ADMIN ONLY
// =================================

const getPendingManualPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getPendingManualPayments();

    return res.status(200).json(payments);
  } catch (error) {
    console.error("GET MANUAL PAYMENTS ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to load manual payments",
    });
  }
};

// =================================
// APPROVE / REJECT MANUAL PAYMENT
// ADMIN ONLY
// =================================

const updateManualPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =================================
    // VALIDATE STATUS
    // =================================

    if (!["success", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be success or failed",
      });
    }

    // =================================
    // FIND PAYMENT
    // =================================

    const paymentResult = await paymentModel.getPaymentById(id);

    if (!paymentResult) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // =================================
    // CHECK PAYMENT TYPE
    // =================================

    if (paymentResult.payment_gateway !== "manual") {
      return res.status(400).json({
        message: "This is not a manual payment",
      });
    }

    // =================================
    // PREVENT DOUBLE PROCESSING
    // =================================

    if (paymentResult.status !== "pending") {
      return res.status(400).json({
        message: `Payment has already been ${paymentResult.status}`,
      });
    }

    // =================================
    // UPDATE PAYMENT
    // =================================

    const updatedPayment = await paymentModel.updatePaymentStatus(id, status, {
      method: "manual",
      verified_by_admin: req.user.id,
    });

    // =================================
    // APPROVED PAYMENT
    // =================================

    if (status === "success") {
      const plan = await vipSectionPlanModel.getPlanById(paymentResult.plan_id);

      if (!plan) {
        return res.status(404).json({
          message: "VIP plan not found",
        });
      }

      // =================================
      // CREATE VIP SUBSCRIPTION
      // =================================

      const expiryDate = new Date();

      expiryDate.setDate(expiryDate.getDate() + Number(plan.duration_days));

      const subscription = await vipSectionSubscriptionModel.createSubscription(
        paymentResult.user_id,
        plan.section_id,
        plan.price,
        expiryDate,
      );

      return res.status(200).json({
        message: "Payment approved and VIP subscription activated",
        payment: updatedPayment,
        subscription,
      });
    }

    // =================================
    // REJECTED PAYMENT
    // =================================

    return res.status(200).json({
      message: "Manual payment rejected",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("UPDATE MANUAL PAYMENT ERROR:", error);

    return res.status(500).json({
      message: "Unable to update manual payment",
    });
  }
};

module.exports = {
  submitManualPayment,
  getPendingManualPayments,
  updateManualPaymentStatus,
};
