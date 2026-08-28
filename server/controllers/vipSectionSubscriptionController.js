const vipSectionSubscriptionModel = require("../models/vipSectionSubscriptionModel");

const vipSectionPlanModel = require("../models/vipSectionPlanModel");

// =================================
// SUBSCRIBE TO VIP SECTION
// =================================

const subscribeToVipSection = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({
        message: "VIP plan is required",
      });
    }

    // =================================
    // VERIFY VIP PLAN FROM DATABASE
    // =================================

    const vipPlan = await vipSectionPlanModel.getPlanById(plan_id);

    if (!vipPlan) {
      return res.status(404).json({
        message: "VIP plan not found",
      });
    }

    // =================================
    // CHECK EXISTING SUBSCRIPTION
    // =================================

    const existingSubscription =
      await vipSectionSubscriptionModel.checkExistingSubscription(
        user_id,
        vipPlan.section_id,
      );

    if (existingSubscription) {
      return res.status(400).json({
        message:
          "You already have an active subscription for this VIP section.",

        subscription: existingSubscription,
      });
    }

    // =================================
    // CREATE EXPIRY DATE FROM REAL VIP PLAN
    // =================================

    const expiry_date = new Date();

    expiry_date.setDate(expiry_date.getDate() + Number(vipPlan.duration_days));

    // =================================
    // CREATE SUBSCRIPTION
    // =================================

    const subscription = await vipSectionSubscriptionModel.createSubscription(
      user_id,

      vipPlan.section_id,

      vipPlan.price,

      expiry_date,
    );

    res.status(201).json({
      message: "VIP section subscribed successfully",

      subscription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// CHECK VIP SECTION ACCESS
// =================================

const checkVipAccess = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { section_id } = req.params;

    const access = await vipSectionSubscriptionModel.checkAccess(
      user_id,
      section_id,
    );

    if (!access) {
      return res.status(403).json({
        message: "VIP subscription required",
      });
    }

    res.status(200).json({
      access: true,

      subscription: access,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET USER VIP SECTIONS
// =================================

const getMyVipSections = async (req, res) => {
  try {
    const user_id = req.user.id;

    const sections =
      await vipSectionSubscriptionModel.getUserVipSections(user_id);

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  subscribeToVipSection,

  checkVipAccess,

  getMyVipSections,
};
