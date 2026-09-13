import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./subscription.css";

function Subscription() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "Rs. 0",
      period: "Forever",
      description: "Try StreamFlix with limited access",
      features: [
        "Limited movies",
        "Basic streaming",
        "Standard experience",
      ],
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "Rs. 499",
      period: "per month",
      description: "Perfect for regular streaming",
      features: [
        "Unlimited movies",
        "Full StreamFlix access",
        "HD streaming",
      ],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "Rs. 4,499",
      period: "per year",
      description: "Best value for StreamFlix fans",
      features: [
        "Unlimited movies",
        "Full StreamFlix access",
        "HD streaming",
        "Best yearly value",
      ],
    },
  ];

  const handleContinue = () => {
    const plan = plans.find(
      (item) => item.id === selectedPlan
    );

    navigate("/payment", {
      state: {
        plan,
      },
    });
  };

  return (
    <div className="subscription-page">

      <div className="subscription-overlay"></div>

      <div className="subscription-container">

        <div className="subscription-header">
          <div className="subscription-logo">
            STREAM<span>FLIX</span>
          </div>

          <h1>Choose Your Plan</h1>

          <p>
            Pick the plan that works best for you
            and start watching on StreamFlix.
          </p>
        </div>

        <div className="plans-grid">

          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${
                selectedPlan === plan.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedPlan(plan.id)
              }
            >

              {plan.id === "yearly" && (
                <div className="popular-badge">
                  BEST VALUE
                </div>
              )}

              <h2>{plan.name}</h2>

              <div className="plan-price">
                {plan.price}
              </div>

              <div className="plan-period">
                {plan.period}
              </div>

              <p className="plan-description">
                {plan.description}
              </p>

              <div className="plan-features">
                {plan.features.map(
                  (feature, index) => (
                    <div
                      className="feature"
                      key={index}
                    >
                      <span>✓</span>
                      {feature}
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                className={
                  selectedPlan === plan.id
                    ? "plan-button active"
                    : "plan-button"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                }}
              >
                {selectedPlan === plan.id
                  ? "Selected ✓"
                  : "Select Plan"}
              </button>

            </div>
          ))}

        </div>

        <button
          className="continue-payment"
          onClick={handleContinue}
        >
          Continue to Payment →
        </button>

        <p className="secure-text">
          🔒 Secure StreamFlix demo checkout
        </p>

      </div>
    </div>
  );
}

export default Subscription;
