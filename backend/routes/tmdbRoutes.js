const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/all/week",
      {
        headers: {
          Authorization:
            "Bearer " + process.env.TMDB_API_READ_ACCESS_TOKEN,
          accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log("TMDB STATUS:", error.response?.status);
    console.log("TMDB DATA:", error.response?.data);
    console.log("TMDB MESSAGE:", error.message);

    res.status(500).json({
      message: "TMDB API request failed",
      status: error.response?.status || null,
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;