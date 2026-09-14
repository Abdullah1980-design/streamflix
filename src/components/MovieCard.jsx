
import { Link } from "react-router-dom";

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&h=750&q=85";

const ANIME_POSTER =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&h=750&q=85";

const SPORTS_POSTER =
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&h=750&q=85";

function cleanUrl(url, fallback = DEFAULT_POSTER) {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  let value = url.trim();

  // [Poster](https://...)
  const markdownMatch = value.match(
    /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (markdownMatch) {
    value = markdownMatch[2].trim();
  }

  // ![Poster](https://...)
  const imageMarkdownMatch = value.match(
    /^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (imageMarkdownMatch) {
    value = imageMarkdownMatch[2].trim();
  }

  value = value.replace(/^["']|["']$/g, "").trim();
  value = value.replace(/\\&/g, "&");
  value = value.replace(/\\\//g, "/");

  const lower = value.toLowerCase();

  if (
    lower.includes("placehold.co") ||
    lower.includes("placeholder.com") ||
    lower.includes("via.placeholder.com") ||
    lower.includes("placehold.it")
  ) {
    return fallback;
  }

  if (value.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${value}`;
  }

  if (value.startsWith("http://")) {
    return value.replace(/^http:\/\//i, "https://");
  }

  if (value.startsWith("https://")) {
    return value;
  }

  return fallback;
}

function MovieCard({ movie }) {
  const categoryText = [
    movie?.category,
    movie?.genre,
    movie?.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isSports =
    categoryText.includes("sport") ||
    categoryText.includes("football") ||
    categoryText.includes("cricket") ||
    categoryText.includes("basketball") ||
    categoryText.includes("tennis");

  const isAnime =
    categoryText.includes("anime") ||
    categoryText.includes("animation");

  let fallbackPoster = DEFAULT_POSTER;

  if (isSports) {
    fallbackPoster = SPORTS_POSTER;
  } else if (isAnime) {
    fallbackPoster = ANIME_POSTER;
  }

  const posterUrl = cleanUrl(
    movie?.poster,
    fallbackPoster
  );

  const movieTitle =
    movie?.title ||
    movie?.name ||
    "Untitled";

  const movieId = movie?._id || movie?.id;

  return (
    <Link
      to={`/movie/${encodeURIComponent(movieId || movieTitle)}`}
      className="movie-card"
    >
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={movieTitle}
          className="movie-poster-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackPoster;
          }}
        />
      </div>

      <div className="movie-info">
        <h3>{movieTitle}</h3>

        {movie?.rating !== undefined &&
          movie?.rating !== null && (
            <p>⭐ {movie.rating}</p>
          )}
      </div>
    </Link>
  );
}

export default MovieCard;

