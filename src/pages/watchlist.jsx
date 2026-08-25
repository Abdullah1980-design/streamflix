import "../App.css";
import { Link } from "react-router-dom";

function Watchlist({
  watchlist,
  removeFromWatchlist
}) {
  return (
    <div className="page">

      <h1 className="page-title">
        ❤️ My Watchlist
      </h1>

      {watchlist.length === 0 ? (

        <div className="empty-list">

          <h2>Your watchlist is empty </h2>

          <p>
            Add movies, anime or sports to your watchlist.
          </p>

          <Link to="/movies">
            <button className="watch-btn">
              🎬 Browse Movies
            </button>
          </Link>

        </div>

      ) : (

        <div className="movie-grid">

          {watchlist.map((movie) => (

            <div
              className="watchlist-item"
              key={movie._id || movie.id || movie.title}
            >

              <Link
                to={`/movie/${encodeURIComponent(movie.title)}`}
                className="card-link"
              >

                <div className="movie-card">

                  <img
                    src={movie.poster || movie.image}
                    alt={movie.title}
                  />

                  <div className="card-overlay">

                    <h3>{movie.title}</h3>

                    <div className="meta">
                      <span>
                        ⭐ {movie.rating || "N/A"}
                      </span>

                      <span>
                        {movie.category || "Movie"}
                      </span>
                    </div>

                  </div>

                </div>

              </Link>

              {/* REMOVE BUTTON */}
              <button
                type="button"
                className="remove-watchlist-btn"
                onClick={() => {
                  removeFromWatchlist(movie.title);
                }}
              >
                ❌Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Watchlist;




