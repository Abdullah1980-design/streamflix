
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/category/Anime";

function Anime({ addToWatchlist }) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(API_URL);

        console.log("ANIME API RESPONSE:", res.data);

        setAnime(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("ANIME API ERROR:", error);
        setAnime([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">
          🎌 Anime Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">
        🎌 Anime Collection
      </h1>

      {anime.length === 0 ? (
        <p className="empty-list">
          No anime found.
        </p>
      ) : (
        <div className="movie-grid">
          {anime.map((movie) => (
            <div
              key={movie._id || movie.id}
              className="movie-card-wrapper"
            >
              <MovieCard movie={movie} />

              {addToWatchlist && (
                <button
                  className="list-btn"
                  onClick={() => addToWatchlist(movie)}
                >
                  + My List
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Anime;

