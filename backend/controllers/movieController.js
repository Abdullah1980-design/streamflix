const Movie = require("../models/Movie");


// Create Movie
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      message: "Movie created successfully",
      movie
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      isDeleted: false
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Single Movie
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.json(movie);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Movie
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Movie updated successfully",
      movie
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Soft Delete Movie
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: "Movie moved to history",
      movie
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Deleted Movies History
const getDeletedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      isDeleted: true
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Restore Movie
const restoreMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.json({
      message: "Movie restored successfully",
      movie
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Get Movies By Category
const getMoviesByCategory = async (req, res) => {
  try {
    const movies = await Movie.find({
      category: req.params.category,
      isDeleted: false
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Search Movies
const searchMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      title: {
        $regex: req.query.title,
        $options: "i"
      },
      isDeleted: false
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Top Rated Movies
const getTopRatedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      isDeleted: false
    })
    .sort({ rating: -1 })
    .limit(10);

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Trending Movies (Latest Added)
const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(10);

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
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
};