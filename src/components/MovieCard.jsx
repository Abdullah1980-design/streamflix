import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
   <Link
  to={`/movie/${encodeURIComponent(movie.title)}`}
  className="card-link"
>
      <div className="movie-card">
        <img
          src={movie.poster}
          alt={movie.title}
        />

        <div className="card-overlay">
          <button
            className="play-btn"
            onClick={(e) => e.preventDefault()}
          >
            ▶
          </button>

          <h3>{movie.title}</h3>

          <div className="meta">
            <span>⭐ {movie.rating || "8.5"}</span>
            <span>{movie.category || "Movie"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;