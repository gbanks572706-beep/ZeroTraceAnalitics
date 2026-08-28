const axios = require("axios");

const vipSectionPlanModel = require("../models/vipSectionPlanModel");
const paymentModel = require("../models/paymentModel");
const vipSectionSubscriptionModel = require("../models/vipSectionSubscriptionModel");

// =================================
// INITIALIZE PAYSTACK PAYMENT
// =================================

const initializePayment = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { plan_id } = req.body;

    // ==============================
    // VALIDATE PLAN ID
    // ==============================

    if (!plan_id) {
      return res.status(400).json({
        message: "VIP plan is required",
      });
    }

    // ==============================
    // GET REAL PLAN FROM DATABASE
    // ==============================

    const plan = await vipSectionPlanModel.getPlanById(plan_id);

    if (!plan) {
      return res.status(404).json({
        message: "VIP plan not found",
      });
    }

    // ==============================
    // CHECK EXISTING VIP SUBSCRIPTION
    // ==============================

    const existingSubscription =
      await vipSectionSubscriptionModel.checkExistingSubscription(
        user_id,
        plan.section_id,
      );

    if (existingSubscription) {
      return res.status(400).json({
        message:
          "You already have an active subscription for this VIP section.",
        subscription: existingSubscription,
      });
    }

    // ==============================
    // CONVERT GHS TO PESEWAS
    // ==============================

    const amount = Math.round(Number(plan.price) * 100);

    // ==============================
    // INITIALIZE PAYSTACK PAYMENT
    // ==============================

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,

        amount,

        currency: "GHS",

        callback_url: `${process.env.FRONTEND_URL}/payment-success.html`,

        metadata: {
          user_id,

          plan_id: plan.id,

          section_id: plan.section_id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json",
        },
      },
    );

    // ==============================
    // SAVE PENDING PAYMENT
    // ==============================

    await paymentModel.createPayment(
      user_id,
      plan.id,
      response.data.data.reference,
      plan.price,
      response.data.data,
    );

    // ==============================
    // RETURN PAYMENT DATA
    // ==============================

    return res.status(200).json({
      message: "Payment initialized successfully",

      authorization_url: response.data.data.authorization_url,

      access_code: response.data.data.access_code,

      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error(
      "PAYSTACK INITIALIZATION ERROR:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: "Unable to initialize payment",
    });
  }
};

module.exports = {
  initializePayment,
};
