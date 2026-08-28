const crypto = require("crypto");

const paymentModel = require("../models/paymentModel");
const vipSectionPlanModel = require("../models/vipSectionPlanModel");
const vipSectionSubscriptionModel = require("../models/vipSectionSubscriptionModel");

// =================================
// PAYSTACK WEBHOOK
// =================================

const handlePaystackWebhook = async (req, res) => {
  try {
    // =================================
    // VERIFY PAYSTACK SIGNATURE
    // =================================

    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res.status(401).send("Unauthorized");
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    // =================================
    // GET PAYSTACK EVENT
    // =================================

    const event = req.body;

    // =================================
    // ONLY PROCESS SUCCESSFUL PAYMENTS
    // =================================

    if (event.event !== "charge.success") {
      return res.status(200).send("Event ignored");
    }

    const paystackData = event.data;

    if (!paystackData || paystackData.status !== "success") {
      return res.status(200).send("Payment not successful");
    }

    const reference = paystackData.reference;

    if (!reference) {
      return res.status(400).send("Payment reference missing");
    }

    // =================================
    // FIND PAYMENT
    // =================================

    const payment = await paymentModel.getPaymentByReference(reference);

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    // =================================
    // PREVENT DUPLICATE PROCESSING
    // =================================

    if (payment.status === "success") {
      return res.status(200).send("Payment already processed");
    }

    // =================================
    // VERIFY PAYMENT AMOUNT
    // =================================

    const expectedAmount = Number(payment.amount) * 100;

    if (Number(paystackData.amount) !== expectedAmount) {
      return res.status(400).send("Payment amount mismatch");
    }

    // =================================
    // GET VIP PLAN
    // =================================

    const plan = await vipSectionPlanModel.getPlanById(payment.plan_id);

    if (!plan) {
      return res.status(404).send("VIP plan not found");
    }

    // =================================
    // MARK PAYMENT SUCCESSFUL
    // =================================

    const updatedPayment = await paymentModel.markPaymentSuccessful(
      reference,
      paystackData,
    );

    // =================================
    // CHECK EXISTING VIP ACCESS
    // =================================

    const existingSubscription =
      await vipSectionSubscriptionModel.checkExistingSubscription(
        payment.user_id,
        plan.section_id,
      );

    if (existingSubscription) {
      return res.status(200).json({
        message: "Payment processed; VIP access already exists",
        payment: updatedPayment,
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
      payment.user_id,
      plan.section_id,
      plan.price,
      expiryDate,
    );

    // =================================
    // SUCCESS
    // =================================

    return res.status(200).json({
      message: "Webhook processed successfully",
      payment: updatedPayment,
      subscription,
    });
  } catch (error) {
    console.error(
      "PAYSTACK WEBHOOK ERROR:",
      error.response?.data || error.message,
    );

    return res.status(500).send("Webhook processing failed");
  }
};

module.exports = {
  handlePaystackWebhook,
};
