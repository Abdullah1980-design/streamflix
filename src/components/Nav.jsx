import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Nav({
  search,
  setSearch,
  watchlist,
  isLoggedIn,
  setIsLoggedIn,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("streamflix-token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo">
        STREAM<span>FLIX</span>
      </Link>

      {/* MAIN LINKS */}
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

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />

        {/* WATCHLIST */}
        <Link
          to="/watchlist"
          className="watchlist"
          title="Watchlist"
        >
          ❤️
          <span>{watchlist?.length || 0}</span>
        </Link>

        {/* PROFILE */}
        <Link
          to="/profile"
          className="profile-btn"
          title="Profile"
        >
          👤
          <span>Profile</span>
        </Link>

        {/* LOGIN / LOGOUT */}
        {isLoggedIn ? (
          <button
            className="login-btn logout-btn"
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