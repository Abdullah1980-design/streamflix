
console.log("=== LATEST INDEX.JS LOADED ===");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const tmdbRoutes = require("./routes/tmdbRoutes");
const subscriptionRoutes = require("./routes/subscription");

// =========================
// MIDDLEWARE
// =========================
const protect = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);

app.use("/api/movies", movieRoutes);

app.use("/api/tmdb", tmdbRoutes);

app.use("/api/subscription", subscriptionRoutes);

// =========================
// TEST ROUTE
// =========================
app.get("/test", (req, res) => {
  res.send("Test route working");
});

// =========================
// PROTECTED PROFILE
// =========================
app.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
  res.send("StreamFlix Backend Running 🚀");
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Server startup error:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

