const vipSectionPlanModel = require("../models/vipSectionPlanModel");

// ==============================
// GET ALL VIP SECTION PLANS
// ==============================

const getVipPlans = async (req, res) => {
  try {
    const plans = await vipSectionPlanModel.getPlans();

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// CREATE VIP SECTION PLAN
// ==============================

const createVipPlan = async (req, res) => {
  try {
    const {
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
    } = req.body;

    const plan = await vipSectionPlanModel.createPlan(
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
    );

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// UPDATE VIP SECTION PLAN
// ==============================

const updateVipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
    } = req.body;

    const plan = await vipSectionPlanModel.updatePlan(
      id,
      section_id,
      plan_name,
      price,
      duration_days,
      description,
      features,
      is_featured,
      status,
    );

    res.status(200).json({
      message: "VIP Plan Updated Successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// DELETE VIP SECTION PLAN
// ==============================

const deleteVipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await vipSectionPlanModel.deletePlan(id);

    if (!plan) {
      return res.status(404).json({
        message: "VIP Plan not found",
      });
    }

    res.status(200).json({
      message: "VIP Plan Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getVipPlans,

  createVipPlan,

  updateVipPlan,

  deleteVipPlan,
};
