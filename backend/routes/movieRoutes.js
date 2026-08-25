const express = require("express");
const router = express.Router();

const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getDeletedMovies,
  restoreMovie,
  getMoviesByCategory,
  searchMovies,
  getTopRatedMovies,
  getTrendingMovies
} = require("../controllers/movieController");
// Create movie
router.get("/", getMovies);

router.get("/history/deleted", getDeletedMovies);

router.put("/restore/:id", restoreMovie);

router.get("/category/:category", getMoviesByCategory);

router.get("/search", searchMovies);

router.get("/top-rated", getTopRatedMovies);

router.get("/trending", getTrendingMovies);

router.get("/:id", getMovieById);

router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);
module.exports = router;