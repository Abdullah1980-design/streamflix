import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

function Nav({
  search,
  setSearch,
  watchlist,
  isLoggedIn,
  setIsLoggedIn,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("streamflix-token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sf-navbar" ref={menuRef}>
      {/* LOGO (STREAM = White, FLIX = Red Accent) */}
      <Link to="/" className="sf-logo">
        <span className="sf-logo-white">STREAM</span>
        <span className="sf-logo-red">FLIX</span>
      </Link>

      {/* SEARCH BAR */}
      <div className="sf-search-container">
        <span className="sf-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search movies, shows..."
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="sf-nav-actions">
        {/* MY LIST */}
        <Link to="/watchlist" className="sf-action-item">
          <span className="sf-action-icon">♡</span>
          <span className="sf-action-label">My List</span>
          {watchlist?.length > 0 && (
            <span className="sf-badge-count">{watchlist.length}</span>
          )}
        </Link>

        {/* NOTIFICATION */}
        <button type="button" className="sf-action-item sf-notification-btn">
          <span className="sf-bell-wrapper">
            <span className="sf-action-icon">🔔</span>
            <span className="sf-badge">3</span>
          </span>
        </button>

        {/* PROFILE */}
        <Link
          to="/profile"
          className={`sf-action-item sf-profile-btn ${
            isActive("/profile") ? "active" : ""
          }`}
        >
          <div className="sf-avatar-pill">👤</div>
          <span className="sf-action-label">Profile</span>
        </Link>

        {/* HAMBURGER TOGGLE */}
        <button
          type="button"
          className="sf-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
      </div>

      {/* DROPDOWN MENU */}
      <div className={`sf-dropdown-menu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/movies" onClick={() => setMenuOpen(false)}>
          Movies
        </Link>
        <Link to="/anime" onClick={() => setMenuOpen(false)}>
          Anime
        </Link>
        <Link to="/sports" onClick={() => setMenuOpen(false)}>
          Sports
        </Link>
        {isLoggedIn ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Nav;