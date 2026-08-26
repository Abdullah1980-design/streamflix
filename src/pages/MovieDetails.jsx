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

      <div
        className="backdrop"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(0,0,0,.95),
              rgba(0,0,0,.4)
            ),
            url(${movie.poster})
          `,
        }}
      >

        <div className="details-content">

          <img
            src={movie.poster}
            alt={movie.title}
            className="detail-poster"
          />

          <div className="info">

            <h1>{movie.title}</h1>

            <div className="tags">

              <span>
                ⭐ {movie.rating || "N/A"}
              </span>

              <span>
                {movie.category || "Movie"}
              </span>

            </div>

            <p>
              {movie.description}
            </p>

            <button
              className="watch-btn"
              onClick={() => setShowPlayer(true)}
            >
              ▶ Watch Now
            </button>

            <button
  className="list-btn"
  onClick={() => addToWatchlist(movie)}
>
  + Add to Watchlist
</button>

            <Link to="/">
              <button className="back-btn">
                ← Back
              </button>
            </Link>

          </div>

        </div>

      </div>

      {showPlayer && (
        <div className="video-section">

          <h2>
            🎬 {movie.title}
          </h2>

          {movie.videoUrl && movie.videoUrl !== "#" ? (
            <video
              className="video-player"
              controls
              src={movie.videoUrl}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="video-unavailable">
              <h3>🎬 Video Not Available</h3>
              <p>
                This movie does not have a playable video yet.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default MovieDetails;