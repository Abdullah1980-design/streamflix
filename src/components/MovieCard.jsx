
import { Link } from "react-router-dom";

function cleanUrl(url) {
  if (!url) return "";

  let value = String(url).trim();

  // Handle Markdown format:
  // [text](https://example.com/image.jpg)
  const markdownMatch = value.match(
    /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
  );

  if (markdownMatch) {
    value = markdownMatch[2].trim();
  }

  // Handle [URL] format
  if (value.startsWith("[") && value.endsWith("]")) {
    value = value.slice(1, -1).trim();
  }

  // Handle relative TMDB poster path
  // Example: /abc123.jpg
  if (value.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${value}`;
  }

  return value;
}

function MovieCard({ movie }) {
  const posterUrl = cleanUrl(movie?.poster);

  return (
    <Link
      to={`/movie/${encodeURIComponent(movie?.title || "")}`}
      className="movie-card"
    >
      <div className="movie-poster">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie?.title || "Movie"}
            className="movie-poster-image"
            loading="lazy"
            onError={(e) => {
              console.error("Poster failed:", posterUrl);

              e.currentTarget.style.display = "none";

              const fallback = e.currentTarget.parentElement.querySelector(
                ".poster-fallback"
              );

              if (fallback) {
                fallback.style.display = "flex";
              }
            }}
          />
        ) : null}

        <div
          className="poster-fallback"
          style={{ display: posterUrl ? "none" : "flex" }}
        >
          No Poster
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie?.title || "Untitled"}</h3>

        {movie?.rating !== undefined && (
          <p>⭐ {movie.rating}</p>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;

