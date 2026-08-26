import "../App.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password || (isSignup && !name)) {
      setMessage(
        isSignup
          ? "Please enter name, email and password."
          : "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const endpoint = isSignup
        ? "https://streamflix-production-30f2.up.railway.app/api/auth/signup"
        : "https://streamflix-production-30f2.up.railway.app/api/auth/login";

      const res = await axios.post(endpoint, {
        ...(isSignup && { name }),
        email,
        password
      });

      console.log("AUTH RESPONSE:", res.data);

      // Save JWT token
      if (res.data.token) {
        localStorage.setItem(
          "streamflix-token",
          res.data.token
        );

        // Update login state
        setIsLoggedIn(true);
      }

      setMessage(
        isSignup
          ? "Account created successfully! 🎉"
          : "Login successful! ✅"
      );

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      console.log("AUTH ERROR:", err);

      setMessage(
        err.response?.data?.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

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
              : "Sign In"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        {/* Switch Login / Signup */}
        <p>

          {isSignup
            ? "Already have an account?"
            : "New to Streamflix?"}

          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setName("");
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

      </div>

    </div>
  );
}

export default Login;