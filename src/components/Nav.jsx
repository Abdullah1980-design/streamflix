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

  /* =========================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
     ========================================================= */

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
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [menuOpen]);

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("streamflix-token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  /* =========================================================
     ACTIVE PAGE
     ========================================================= */

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" ref={menuRef}>

      {/* =====================================================
          LOGO
          ===================================================== */}

      <Link to="/" className="logo">
        <span className="logo-stream">STREAM</span>
        <span className="logo-flix">FLIX</span>
      </Link>

      {/* =====================================================
          SEARCH
          ===================================================== */}

      <div className="search-container">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search movies, shows"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* =====================================================
          RIGHT ACTIONS
          ===================================================== */}

      <div className="nav-actions">

        {/* MY LIST */}

        <Link
          to="/watchlist"
          className="action-item"
        >
          <span className="action-icon">♡</span>

          <span>My List</span>

          {watchlist?.length > 0 && (
            <span className="watchlist-count">
              {watchlist.length}
            </span>
          )}
        </Link>


        {/* NOTIFICATION */}

        <button
          type="button"
          className="action-item notification-btn"
        >
          <span className="bell-wrapper">
            <span className="bell-icon">🔔</span>

            <span className="badge">
              3
            </span>
          </span>
        </button>


        {/* PROFILE */}

        <Link
          to="/profile"
          className={`action-item profile-btn ${
            isActive("/profile") ? "active" : ""
          }`}
        >
          <span className="profile-icon">
            👤
          </span>
        </Link>


        {/* HAMBURGER */}

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

      </div>


      {/* =====================================================
          DROPDOWN MENU
          ===================================================== */}

      <div
        className={`dropdown-menu ${
          menuOpen ? "active" : ""
        }`}
      >

        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/movies"
          onClick={() => setMenuOpen(false)}
        >
          Movies
        </Link>

        <Link
          to="/anime"
          onClick={() => setMenuOpen(false)}
        >
          Anime
        </Link>

        <Link
          to="/sports"
          onClick={() => setMenuOpen(false)}
        >
          Sports
        </Link>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Nav;