const User = require("../models/User");

// =========================
// Activate Subscription
// =========================
const activateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["free", "monthly", "yearly"].includes(plan)) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Free plan
    if (plan === "free") {
      user.subscriptionStatus = "active";
      user.subscriptionPlan = "free";
      user.subscriptionExpiresAt = null;
    }

    // Monthly plan
    if (plan === "monthly") {
      user.subscriptionStatus = "active";
      user.subscriptionPlan = "monthly";

      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      user.subscriptionExpiresAt = expiry;
    }

    // Yearly plan
    if (plan === "yearly") {
      user.subscriptionStatus = "active";
      user.subscriptionPlan = "yearly";

      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);

      user.subscriptionExpiresAt = expiry;
    }

    await user.save();

    res.json({
      message: "Subscription activated successfully",
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    });
  } catch (error) {
    console.error("SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  activateSubscription,
};