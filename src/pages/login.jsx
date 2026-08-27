import "../App.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://streamflix-production-30f2.up.railway.app/api/auth";


  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // =========================
    // SIGNUP
    // =========================
    if (isSignup) {
      if (!name || !email || !password) {
        setMessage(
          "Please enter name, email and password."
        );
        return;
      }

      try {
        setLoading(true);

        const res = await axios.post(
          `${API_URL}/signup`,
          {
            name,
            email,
            password
          }
        );

        console.log("SIGNUP RESPONSE:", res.data);

        setMessage(
          "Account created successfully! 🎉"
        );

        setTimeout(() => {
          setIsSignup(false);
          setName("");
          setPassword("");
          setMessage("");
        }, 1200);

      } catch (err) {
        console.log("SIGNUP ERROR:", err);

        setMessage(
          err.response?.data?.message ||
          "Something went wrong."
        );

      } finally {
        setLoading(false);
      }

      return;
    }


    // =========================
    // LOGIN STEP 1
    // EMAIL + PASSWORD
    // =========================

    if (!email || !password) {
      setMessage(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password
        }
      );

      console.log(
        "LOGIN OTP RESPONSE:",
        res.data
      );

      // OTP sent
      setOtpStep(true);

      setMessage(
        `OTP sent to ${email} 📧`
      );

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      setMessage(
        err.response?.data?.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // LOGIN STEP 2
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!otp || otp.length !== 6) {
      setMessage(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/verify-otp`,
        {
          email,
          otp
        }
      );

      console.log(
        "OTP VERIFY RESPONSE:",
        res.data
      );

      // Save JWT
      if (res.data.token) {
        localStorage.setItem(
          "streamflix-token",
          res.data.token
        );

        setIsLoggedIn(true);
      }

      setMessage(
        "Login successful! ✅"
      );

      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (err) {
      console.log(
        "OTP VERIFY ERROR:",
        err
      );

      setMessage(
        err.response?.data?.message ||
        "Invalid OTP."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-box">

        {/* =========================
            OTP SCREEN
        ========================= */}

        {otpStep ? (

          <>
            <h1>Verify Your Email</h1>

            <p>
              We sent a 6-digit OTP to
              <br />
              <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOtp}>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </form>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            <p
              style={{
                cursor: "pointer",
                marginTop: "15px"
              }}
              onClick={() => {
                setOtpStep(false);
                setOtp("");
                setMessage("");
              }}
            >
              ← Back to Login
            </p>
          </>

        ) : (

          /* =========================
             LOGIN / SIGNUP SCREEN
          ========================= */

          <>
            <h1>
              {isSignup
                ? "Create Account"
                : "Sign In"}
            </h1>

            <form onSubmit={handleSubmit}>

              {/* Name - Signup only */}
              {isSignup && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              )}

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                  ? "Sign Up"
                  : "Continue"}
              </button>

            </form>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            <p>

              {isSignup
                ? "Already have an account?"
                : "New to Streamflix?"}

              <span
                onClick={() => {
                  setIsSignup(!isSignup);
                  setName("");
                  setPassword("");
                  setMessage("");
                }}
                style={{
                  cursor: "pointer",
                  marginLeft: "5px"
                }}
              >
                {isSignup
                  ? "Sign in."
                  : "Sign up now."}
              </span>

            </p>

          </>
        )}

      </div>

    </div>
  );
}

export default Login;
