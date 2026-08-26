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
    return <div className="loading">Movie Loading...</div>;
  }

  if (!movie) {
    return (
      <div className="loading">
        <h1>Movie Not Found</h1>

        <Link to="/">
          <button className="back-btn">← Back Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page">

      {/* MOVIE DETAILS */}
      <div className="movie-details">

        <div className="details-poster">
          <img
            src={movie.poster}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="details-info">

          <h1>{movie.title}</h1>

          <div className="details-meta">
            <span>⭐ {movie.rating}</span>
            <span>{movie.category}</span>
          </div>

          <p>{movie.description}</p>

          {/* ACTION BUTTONS */}
          <div className="details-buttons">

            <button
              className="watch-now-btn"
              onClick={() => setShowPlayer(true)}
            >
              ▶ Watch Now
            </button>

            {addToWatchlist && (
              <button
                className="watchlist-btn"
                onClick={() => addToWatchlist(movie)}
              >
                + Watchlist
              </button>
            )}

          </div>

          {/* BACK BUTTON */}
          <Link to="/" className="back-link">
            ← Back Home
          </Link>

        </div>
      </div>

      {/* VIDEO PLAYER */}
      {showPlayer && (
        <div className="player-section">

          <div className="player-header">

            <h2>▶ {movie.title}</h2>

            <button
              className="close-player-btn"
              onClick={() => setShowPlayer(false)}
            >
              ✕ Close Player
            </button>

          </div>

          {movie.videoUrl && movie.videoUrl !== "#" ? (
            <video
              className="main-video-player"
              controls
              autoPlay
              src={movie.videoUrl}
            />
          ) : (
            <div className="video-unavailable">
              <h3>Video Not Available</h3>
              <p>This movie doesn't have a video yet.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default MovieDetails;