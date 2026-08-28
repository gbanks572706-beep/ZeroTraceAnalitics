const subscriptionModel = require("../models/subscriptionModel");

// Check User Subscription Status

const checkSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.getActiveSubscription(
      req.user.id,
    );

    if (!subscription) {
      return res.status(200).json({
        active: false,
      });
    }

    res.status(200).json({
      active: true,

      subscription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  checkSubscription,
};
