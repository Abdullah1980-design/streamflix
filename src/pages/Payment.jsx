import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = location.state?.plan;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!plan) {
    return (
      <div className="payment-page">
        <div className="payment-box">
          <h1>No Plan Selected</h1>

          <p>Please select a StreamFlix subscription plan first.</p>

          <button
            className="payment-button"
            onClick={() => navigate("/subscription")}
          >
            Choose Plan
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("streamflix-token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://streamflix-production-30f2.up.railway.app/api/subscription/activate",
        {
          plan: plan.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SUBSCRIPTION RESPONSE:", res.data);

      localStorage.setItem(
        "streamflix-subscription",
        JSON.stringify({
          status: res.data.subscriptionStatus,
          plan: res.data.subscriptionPlan,
          expiresAt: res.data.subscriptionExpiresAt,
        })
      );

      setMessage("Subscription activated successfully! 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.log("PAYMENT ERROR:", err);

      setMessage(
        err.response?.data?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-overlay"></div>

      <div className="payment-container">

        <div className="payment-header">
          <div className="payment-logo">
            STREAM<span>FLIX</span>
          </div>

          <h1>Complete Your Subscription</h1>

          <p>
            Secure demo checkout for your StreamFlix plan
          </p>
        </div>

        <div className="payment-layout">

          {/* PLAN SUMMARY */}
          <div className="payment-summary">

            <div className="summary-label">
              SELECTED PLAN
            </div>

            <h2>{plan.name}</h2>

            <div className="summary-price">
              {plan.price}
            </div>

            <div className="summary-period">
              {plan.period}
            </div>

            <div className="summary-line"></div>

            {plan.features.map((feature, index) => (
              <div className="summary-feature" key={index}>
                <span>✓</span>
                {feature}
              </div>
            ))}

          </div>

          {/* DEMO CHECKOUT */}
          <div className="payment-card">

            <div className="demo-badge">
              DEMO PAYMENT
            </div>

            <h2>Payment Details</h2>

            <p className="payment-note">
              This is a demo checkout for the StreamFlix
              project. No real payment will be charged.
            </p>

            <form onSubmit={handlePayment}>

              <div className="demo-field">
                <label>Account Name</label>

                <input
                  type="text"
                  placeholder="StreamFlix User"
                  required
                />
              </div>

              <div className="demo-field">
                <label>Payment Method</label>

                <div className="fake-payment-method">
                  <span>💳</span>
                  Demo Card Payment
                  <span className="demo-check">✓</span>
                </div>
              </div>

              <div className="demo-security">
                🔒 Demo transaction — no real card information
                is required.
              </div>

              <button
                type="submit"
                className="payment-button"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Confirm ${plan.name} Plan →`}
              </button>

            </form>

            {message && (
              <div className="payment-message">
                {message}
              </div>
            )}

            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/subscription")}
            >
              ← Back to Plans
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Payment;