import "../App.css";
import MovieCard from "../components/MovieCard";
import Hero from "../components/hero";
import { useEffect, useState } from "react";
import axios from "axios";

function Home({ search }) {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [moviesRes, trendingRes] = await Promise.all([
          axios.get(
            "https://streamflix-production-30f2.up.railway.app/api/movies"
          ),
          axios.get(
            "https://streamflix-production-30f2.up.railway.app/api/movies/trending"
          ),
        ]);

        setMovies(moviesRes.data);
        setTrending(trendingRes.data);
      } catch (err) {
        console.log("HOME MOVIES ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const matchesSearch = (movie) =>
    movie.title?.toLowerCase().includes((search || "").toLowerCase());

  const popularMovies = movies
    .filter(
      (movie) => movie.category === "Movie" && matchesSearch(movie)
    )
    .slice(0, 10);

  const trendingMovies = trending.filter(matchesSearch);

  return (
    <div className="home">
      <Hero />

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <>
          <section>
            <h2>🔥 Trending</h2>

            <div className="movie-grid">
              {trendingMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          </section>

          <section>
            <h2>🎬 Popular Movies</h2>

            <div className="movie-grid">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;