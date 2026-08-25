import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Nav({
  search,
  setSearch,
  watchlist,
  isLoggedIn,
  setIsLoggedIn
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("streamflix-token");

    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        STREAM<span>FLIX</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/movies">
          Movies
        </Link>

        <Link to="/anime">
          Anime
        </Link>

        <Link to="/sports">
          Sports
        </Link>

      </div>

      <div className="nav-right">

        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="search"
        />

        <Link
          to="/watchlist"
          className="watchlist"
        >
          ❤️ {watchlist?.length || 0}
        </Link>

        <Link
          to="/profile"
          className="profile-btn"
        >
          👤
        </Link>

        {isLoggedIn ? (

          <button
            className="login-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

        )}

      </div>

    </nav>
  );
}

export default Nav;