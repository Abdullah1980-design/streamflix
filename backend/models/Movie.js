const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    poster: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    videoUrl: {
      type: String
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Movie", movieSchema);