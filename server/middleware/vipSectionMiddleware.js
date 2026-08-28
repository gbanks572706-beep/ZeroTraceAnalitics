const vipSectionSubscriptionModel = require("../models/vipSectionSubscriptionModel");

// ======================================
// CHECK ACCESS TO A VIP SECTION
// ======================================

const vipSectionOnly = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const section_id = req.params.section_id;

    const subscription = await vipSectionSubscriptionModel.checkAccess(
      user_id,
      section_id,
    );

    if (!subscription) {
      return res.status(403).json({
        message: "VIP section subscription required",
      });
    }

    req.subscription = subscription;

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  vipSectionOnly,
};
