import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

function Sports({ addToWatchlist }) {
  const [sports, setSports] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://streamflix-production-30f2.up.railway.app/api/movies/category/Sports")
      .then((res) => {
        console.log("SPORTS API RESPONSE:", res.data);
        setSports(res.data);
      })
      .catch((err) => {
        console.log("SPORTS API ERROR:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredSports =
    category === "All"
      ? sports
      : sports.filter(
          (sport) =>
            sport.category?.toLowerCase() ===
            category.toLowerCase()
        );

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">
          ⚽ Sports Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="page">

      <h1 className="page-title">
        ⚽ Sports Live
      </h1>

      <div className="sports-filters">

        <button
          onClick={() => setCategory("All")}
          className={category === "All" ? "active" : ""}
        >
          All ({sports.length})
        </button>

      </div>

      {filteredSports.length === 0 ? (
        <p className="empty-list">
          No sports found.
        </p>
      ) : (
        <div className="movie-grid">

          {filteredSports.map((sport) => (
            <MovieCard
              key={sport._id}
              movie={sport}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Sports;