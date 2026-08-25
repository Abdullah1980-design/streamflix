import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

function Anime({ addToWatchlist }) {
  const [anime, setAnime] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/movies/category/Anime")
      .then((res) => {
        console.log("ANIME API RESPONSE:", res.data);
        setAnime(res.data);
      })
      .catch((err) => {
        console.log("ANIME API ERROR:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredAnime =
    category === "All"
      ? anime
      : anime.filter((movie) => movie.category === category);

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">Loading Anime...</h1>
      </div>
    );
  }

  return (
    <div className="page">

      <h1 className="page-title">
        🎌 Anime Collection
      </h1>

      <div className="anime-filters">

        <button onClick={() => setCategory("All")}>
          All ({anime.length})
        </button>

        <button onClick={() => setCategory("Anime")}>
          Anime
        </button>

      </div>

      <div className="movie-grid">

        {filteredAnime.map((movie) => (
          <div key={movie._id}>

            <MovieCard movie={movie} />

            <button
              className="list-btn"
              onClick={() => addToWatchlist(movie)}
            >
              + My List
            </button>

          </div>
        ))}

      </div>

      {filteredAnime.length === 0 && (
        <p className="empty-list">
          No anime found.
        </p>
      )}

    </div>
  );
}

export default Anime;