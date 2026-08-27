const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


// =========================
// Signup
// =========================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =========================
// Login - Step 1
// Check credentials and send OTP
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const matchPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash OTP before storing
    const otpHash = await bcrypt.hash(
      otp,
      10
    );

    // OTP expires after 5 minutes
    user.otpHash = otpHash;

    user.otpExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();


    // Send OTP email
    await resend.emails.send({
      from: "StreamFlix <onboarding@resend.dev>",
      to: [email],
      subject: "Your StreamFlix Login OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
        ">

          <h2>StreamFlix Login Verification</h2>

          <p>Your StreamFlix verification code is:</p>

          <h1 style="
            letter-spacing: 8px;
            font-size: 32px;
          ">
            ${otp}
          </h1>

          <p>
            This code will expire in 5 minutes.
          </p>

          <p>
            If you did not try to login,
            you can ignore this email.
          </p>

        </div>
      `
    });


    res.json({
      message: "OTP sent successfully",
      email
    });

  } catch (error) {

    console.error(
      "LOGIN OTP ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// =========================
// Verify OTP - Step 2
// Verify OTP and create JWT
// =========================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    // Check OTP exists
    if (
      !user.otpHash ||
      !user.otpExpiresAt
    ) {
      return res.status(400).json({
        message: "No OTP requested"
      });
    }


    // Check OTP expiry
    if (
      new Date() > user.otpExpiresAt
    ) {

      user.otpHash = null;
      user.otpExpiresAt = null;

      await user.save();

      return res.status(400).json({
        message: "OTP expired"
      });
    }


    // Compare entered OTP
    const otpMatch = await bcrypt.compare(
      otp,
      user.otpHash
    );

    if (!otpMatch) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }


    // OTP verified
    // Clear OTP from database
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();


    // Create JWT
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.error(
      "OTP VERIFY ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// =========================
// Get Profile
// =========================
const getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// =========================
// EXPORTS
// =========================
module.exports = {
  signup,
  login,
  verifyOtp,
  getProfile
};