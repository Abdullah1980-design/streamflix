
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/category/Sports";

function Sports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get(API_URL);

        console.log("SPORTS API RESPONSE:", res.data);

        setSports(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("SPORTS API ERROR:", error);
        setSports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

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

      {sports.length === 0 ? (
        <p className="empty-list">
          No sports found.
        </p>
      ) : (
        <div className="movie-grid">
          {sports.map((sport) => (
            <MovieCard
              key={sport._id || sport.id}
              movie={sport}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Sports;

