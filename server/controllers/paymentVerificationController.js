const axios = require("axios");

const paymentModel = require("../models/paymentModel");
const vipSectionPlanModel = require("../models/vipSectionPlanModel");
const vipSectionSubscriptionModel = require("../models/vipSectionSubscriptionModel");

// =================================
// VERIFY PAYSTACK PAYMENT
// =================================

const verifyPayment = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { reference } = req.body;

    // =================================
    // CHECK REFERENCE
    // =================================

    if (!reference) {
      return res.status(400).json({
        message: "Payment reference is required",
      });
    }

    // =================================
    // FIND PAYMENT
    // =================================

    const payment = await paymentModel.getPaymentByReference(reference);

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    // =================================
    // VERIFY PAYMENT BELONGS TO USER
    // =================================

    if (Number(payment.user_id) !== Number(user_id)) {
      return res.status(403).json({
        message: "You are not authorized to verify this payment",
      });
    }

    // =================================
    // PREVENT DUPLICATE PROCESSING
    // =================================

    if (payment.status === "success") {
      return res.status(200).json({
        message: "Payment already verified",
        payment,
      });
    }

    // =================================
    // GET VIP PLAN
    // =================================

    const plan = await vipSectionPlanModel.getPlanById(payment.plan_id);

    if (!plan) {
      return res.status(404).json({
        message: "VIP plan no longer exists",
      });
    }

    // =================================
    // VERIFY WITH PAYSTACK
    // =================================

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = response.data.data;

    // =================================
    // CHECK PAYMENT STATUS
    // =================================

    if (paystackData.status !== "success") {
      return res.status(400).json({
        message: "Payment has not been completed",
        status: paystackData.status,
      });
    }

    // =================================
    // CHECK PAYMENT AMOUNT
    // PAYSTACK RETURNS AMOUNT IN PESEWAS
    // =================================

    const expectedAmount = Number(payment.amount) * 100;

    if (Number(paystackData.amount) !== expectedAmount) {
      return res.status(400).json({
        message: "Payment amount does not match VIP plan price",
      });
    }

    // =================================
    // MARK PAYMENT SUCCESSFUL
    // =================================

    const updatedPayment = await paymentModel.markPaymentSuccessful(
      reference,
      paystackData,
    );

    // =================================
    // CHECK EXISTING VIP SUBSCRIPTION
    // =================================

    const existingSubscription =
      await vipSectionSubscriptionModel.checkExistingSubscription(
        user_id,
        plan.section_id,
      );

    if (existingSubscription) {
      return res.status(200).json({
        message: "Payment verified; VIP access already exists",
        payment,
        subscription: existingSubscription,
      });
    }

    // =================================
    // CALCULATE VIP EXPIRY
    // =================================

    const expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + Number(plan.duration_days));

    // =================================
    // CREATE VIP SUBSCRIPTION
    // =================================

    const subscription = await vipSectionSubscriptionModel.createSubscription(
      user_id,
      plan.section_id,
      plan.price,
      expiryDate,
    );

    // =================================
    // SUCCESS RESPONSE
    // =================================

    res.status(200).json({
      message: "Payment verified and VIP subscription activated",
      payment: updatedPayment,
      subscription,
    });
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error.response?.data || error);

    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  verifyPayment,
};
