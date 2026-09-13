import { Link } from "react-router-dom";

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&h=750&q=85";

const SPORTS_POSTER =
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&h=750&q=85";

function cleanUrl(url, fallback = DEFAULT_POSTER) {
  if (
    !url ||
    typeof url !== "string" ||
    url.trim() === "" ||
    url === "null" ||
    url === "undefined"
  ) {
    return fallback;
  }

  let value = url.trim();

  /* Markdown:
     [Poster](https://example.com/image.jpg)
  */
  const markdownMatch = value.match(
    /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (markdownMatch) {
    value = markdownMatch[2].trim();
  }

  /* Markdown image:
     ![Poster](https://example.com/image.jpg)
  */
  const imageMarkdownMatch = value.match(
    /^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (imageMarkdownMatch) {
    value = imageMarkdownMatch[2].trim();
  }

  /* Remove quotes */
  value = value.replace(/^["']|["']$/g, "").trim();

  /* Railway placeholder detection */
  const lowerValue = value.toLowerCase();

  if (
    lowerValue.includes("placehold.co") ||
    lowerValue.includes("placeholder.com") ||
    lowerValue.includes("via.placeholder.com") ||
    lowerValue.includes("placehold.it")
  ) {
    return fallback;
  }

  /* TMDB relative poster */
  if (value.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${value}`;
  }

  /* HTTP -> HTTPS */
  if (value.startsWith("http://")) {
    return value.replace(/^http:\/\//i, "https://");
  }

  /* Valid HTTPS */
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

  const isSports = categoryText.includes("sport");

  const fallbackPoster = isSports
    ? SPORTS_POSTER
    : DEFAULT_POSTER;

  const posterUrl = cleanUrl(
    movie?.poster,
    fallbackPoster
  );

  const movieTitle =
    movie?.title ||
    movie?.name ||
    "Untitled";

  return (
    <Link
      to={`/movie/${encodeURIComponent(
        movie?._id || movieTitle
      )}`}
      className="movie-card"
    >
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={movieTitle}
          className="movie-poster-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackPoster;
          }}
        />

        <div
          className="poster-fallback"
          style={{ display: "none" }}
        >
          No Poster
        </div>
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