import "../App.css";
import MovieCard from "../components/MovieCard";
import Hero from "../components/hero";
import { useEffect, useState } from "react";
import axios from "axios";

function Home({ search }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/movies"
        );

        setMovies(res.data);
      } catch (err) {
        console.log("HOME MOVIES ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title
      ?.toLowerCase()
      .includes((search || "").toLowerCase())
  );

  return (
    <div className="home">

      <Hero />

      <section>

        <h2>🔥 Trending Movies</h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : filteredMovies.length === 0 ? (
          <p>No movies found 🔍</p>
        ) : (
          <div className="movie-grid">

            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
              />
            ))}

          </div>
        )}

      </section>

      <section>

        <h2>🎬 Popular Movies</h2>

        <div className="movie-grid">

          {movies
            .filter(
              (movie) =>
                movie.category === "Movie"
            )
            .slice(0, 5)
            .map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
              />
            ))}

        </div>

      </section>

    </div>
  );
}

export default Home;