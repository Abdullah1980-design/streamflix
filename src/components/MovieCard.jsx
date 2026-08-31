import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${encodeURIComponent(movie.title)}`}
      className="movie-card"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="movie-poster"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>⭐ {movie.rating}</p>
      </div>
    </Link>
  );
}

export default MovieCard;