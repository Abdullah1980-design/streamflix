import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function MovieDetails({ addToWatchlist }) {
  const { title } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieTitle = decodeURIComponent(title);

        const res = await axios.get(
          "https://streamflix-production-30f2.up.railway.app/api/movies/search",
          {
            params: {
              title: movieTitle,
            },
          }
        );

        if (res.data.length > 0) {
          setMovie(res.data[0]);
        }
      } catch (err) {
        console.log("MOVIE DETAILS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [title]);

  if (loading) {
    return (
      <h1 className="loading">
        Movie Loading...
      </h1>
    );
  }

  if (!movie) {
    return (
      <div className="loading">
        <h1>Movie Not Found</h1>

        <Link to="/">
          <button className="back-btn">
            ← Back Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details">

      <div className="details-poster">
        <img
          src={movie.poster}
          alt={movie.title}
        />
      </div>

      <div className="details-info">

        <h1>{movie.title}</h1>

        <div className="details-meta">
          <span>⭐ {movie.rating}</span>
          <span>{movie.category}</span>
        </div>

        <p>
          {movie.description}
        </p>

        <div className="details-buttons">

          <button
            className="play-btn"
            onClick={() => setShowPlayer(true)}
          >
            ▶ Watch Now
          </button>

          {addToWatchlist && (
            <button
              className="back-btn"
              onClick={() => addToWatchlist(movie)}
            >
              + Watchlist
            </button>
          )}

        </div>

        <Link to="/">
          <button className="back-btn">
            ← Back Home
          </button>
        </Link>

      </div>

      {showPlayer && (
        <div className="video-player">
          <button
            className="back-btn"
            onClick={() => setShowPlayer(false)}
          >
            ✕ Close
          </button>

          {movie.videoUrl && movie.videoUrl !== "#" ? (
            <video
              controls
              autoPlay
              src={movie.videoUrl}
              width="100%"
            />
          ) : (
            <p>
              Video is not available yet.
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default MovieDetails;
