import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Nav from "./components/Nav";
import Footer from "./components/footer";

import Home from "./pages/home";
import Anime from "./pages/anime";
import Movies from "./pages/movie";
import Sports from "./pages/sports";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Watchlist from "./pages/watchlist";
import MovieDetails from "./pages/MovieDetails";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("streamflix-token")
  );

  // Load watchlist from localStorage
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem(
      "streamflix-watchlist"
    );

    return savedWatchlist
      ? JSON.parse(savedWatchlist)
      : [];
  });

  // Save watchlist whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "streamflix-watchlist",
      JSON.stringify(watchlist)
    );
  }, [watchlist]);

  // Add movie to watchlist
  const addToWatchlist = (movie) => {
    const alreadyAdded = watchlist.some(
      (item) => item.title === movie.title
    );

    if (!alreadyAdded) {
      setWatchlist([
        ...watchlist,
        movie
      ]);
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = (title) => {
    setWatchlist(
      watchlist.filter(
        (movie) => movie.title !== title
      )
    );
  };

  return (
  <BrowserRouter>

    <SplashScreen />

    <Nav
      search={search}
      setSearch={setSearch}
      watchlist={watchlist}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    />
      <Routes>

        <Route
          path="/"
          element={
            <Home search={search} />
          }
        />

        <Route
          path="/anime"
          element={
            <Anime
              addToWatchlist={addToWatchlist}
            />
          }
        />

        <Route
          path="/movies"
          element={
            <Movies
              addToWatchlist={addToWatchlist}
            />
          }
        />

        <Route
          path="/sports"
          element={
            <Sports
              addToWatchlist={addToWatchlist}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              watchlist={watchlist}
            />
          }
        />

        <Route
          path="/watchlist"
          element={
            <Watchlist
              watchlist={watchlist}
              removeFromWatchlist={
                removeFromWatchlist
              }
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        <Route
          path="/movie/:title"
          element={
            <MovieDetails
              addToWatchlist={
                addToWatchlist
              }
            />
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;