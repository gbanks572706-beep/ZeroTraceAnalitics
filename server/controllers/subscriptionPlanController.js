const subscriptionPlanModel = require("../models/subscriptionPlanModel");

// Get Subscription Plans (Public)

const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await subscriptionPlanModel.getPlans();

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Subscription Plan (Admin)

const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, duration_days, description } = req.body;

    const plan = await subscriptionPlanModel.createPlan(
      name,
      price,
      duration_days,
      description,
    );

    res.status(201).json({
      message: "Subscription plan created successfully",

      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Subscription Plan (Admin)

const updateSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, duration_days, description, status } = req.body;

    const plan = await subscriptionPlanModel.updatePlan(
      req.params.id,
      name,
      price,
      duration_days,
      description,
      status,
    );

    res.status(200).json({
      message: "Subscription plan updated successfully",

      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Subscription Plan (Admin)

const deleteSubscriptionPlan = async (req, res) => {
  try {
    const plan = await subscriptionPlanModel.deletePlan(req.params.id);

    res.status(200).json({
      message: "Subscription plan deleted successfully",

      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSubscriptionPlans,

  createSubscriptionPlan,

  updateSubscriptionPlan,

  deleteSubscriptionPlan,
};
