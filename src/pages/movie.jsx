import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/category/Movie";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(API_URL);

        console.log("MOVIES PAGE RESPONSE:", res.data);

        setMovies(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("MOVIES PAGE ERROR:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">🎬 Movies Loading...</h1>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">🎬 Movies</h1>

      {movies.length === 0 ? (
        <p className="empty-list">No movies found.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id || movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;