const express = require("express");

const router = express.Router();

const {
  activateSubscription,
} = require("../controllers/subscriptionController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/activate",
  authMiddleware,
  activateSubscription
);

module.exports = router;
