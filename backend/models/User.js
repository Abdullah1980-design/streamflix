const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // OTP
    // =========================
    otpHash: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    // =========================
    // SUBSCRIPTION
    // =========================
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "monthly", "yearly"],
      default: "free",
    },

    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);