const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  verifyOtp,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;