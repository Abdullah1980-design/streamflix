import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/trending";

/* =========================================================
   STREAMFLIX — RELIABLE TMDB FALLBACK IMAGES
   ========================================================= */

const BACKUP_POSTERS = [
  "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
  "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
  "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
];
const BACKUP_HEROES = [
  "https://image.tmdb.org/t/p/original/9mmv2b7Y0q9g1gK3k5x5Y6J5J4.jpg",
  "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
  "https://image.tmdb.org/t/p/original/5mVzP7Y0M5jV2Q9y8P8P7y4J8H.jpg",
];

/* =========================================================
   FALLBACK MOVIES
   API FAIL HONE PAR BHI HOME EMPTY NAHI HOGA
   ========================================================= */

const FALLBACK_MOVIES = [
  {
    _id: "fallback-1",
    title: "Inception",
    year: "2010",
    rating: "PG-13",
    genre: "Action",
    duration: "2h 28m",
    description:
      "A mind-bending journey through dreams, memories and impossible realities.",
    poster: BACKUP_POSTERS[0],
    background: BACKUP_HEROES[0],
    category: "action",
  },
  {
    _id: "fallback-2",
    title: "Interstellar",
    year: "2014",
    rating: "PG-13",
    genre: "Drama",
    duration: "2h 49m",
    description:
      "A team of explorers travels beyond our galaxy in search of a future for humanity.",
    poster: BACKUP_POSTERS[1],
    background: BACKUP_HEROES[1],
    category: "drama",
  },
  {
    _id: "fallback-3",
    title: "Avengers",
    year: "2012",
    rating: "PG-13",
    genre: "Action",
    duration: "2h 23m",
    description:
      "Earth's greatest heroes unite to protect the world from a powerful enemy.",
    poster: BACKUP_POSTERS[2],
    background: BACKUP_HEROES[2],
    category: "action",
  },
  {
    _id: "fallback-4",
    title: "Stranger Things",
    year: "2016",
    rating: "16+",
    genre: "TV Shows",
    duration: "4 Seasons",
    description:
      "A group of friends discovers mysterious events surrounding their small town.",
    poster: BACKUP_POSTERS[3],
    background: BACKUP_HEROES[0],
    category: "tv",
    type: "tv",
  },
  {
    _id: "fallback-5",
    title: "The Batman",
    year: "2022",
    rating: "PG-13",
    genre: "Action",
    duration: "2h 56m",
    description:
      "Batman investigates a series of crimes that reveal a dark mystery in Gotham.",
    poster: BACKUP_POSTERS[4],
    background: BACKUP_HEROES[1],
    category: "action",
  },
  {
    _id: "fallback-6",
    title: "The Creator",
    year: "2023",
    rating: "PG-13",
    genre: "Action",
    duration: "2h 13m",
    description:
      "Humanity and artificial intelligence collide in an epic futuristic battle.",
    poster: BACKUP_POSTERS[5],
    background: BACKUP_HEROES[2],
    category: "action",
  },
];

/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  { name: "Home", key: "all", icon: "🏠" },
  { name: "Movies", key: "movies", icon: "🎬" },
  { name: "TV Shows", key: "tvShows", icon: "📺" },
  { name: "Action", key: "action", icon: "⚡" },
  { name: "Drama", key: "drama", icon: "🎭" },
  { name: "Comedy", key: "comedy", icon: "😄" },
  { name: "Horror", key: "horror", icon: "👻" },
  { name: "Romance", key: "romance", icon: "♡" },
  { name: "Kids", key: "kids", icon: "👨‍👩‍👧‍👦" },
  { name: "Documentary", key: "documentary", icon: "📄" },
];

/* =========================================================
   IMAGE URL CLEANER
   Handles:
   - TMDB paths
   - http
   - https
   - Markdown URLs
   - empty/null values
   ========================================================= */

function getValidImageUrl(url, defaultImg, type = "poster") {
  if (
    !url ||
    typeof url !== "string" ||
    url.trim() === "" ||
    url === "null" ||
    url === "undefined"
  ) {
    return defaultImg;
  }

  let str = url.trim();

  /* Remove Markdown image/link wrapper */
  const markdownMatch = str.match(/\]\((https?:\/\/[^)]+)\)/i);

  if (markdownMatch) {
    str = markdownMatch[1];
  }

  /* Remove quotes */
  str = str.replace(/^["']|["']$/g, "");

  /* TMDB full URL */
  if (str.includes("image.tmdb.org")) {
    return str.replace("http://", "https://");
  }

  /* TMDB relative path */
  if (str.startsWith("/")) {
    const size = type === "backdrop" ? "original" : "w500";
    return `https://image.tmdb.org/t/p/${size}${str}`;
  }

  /* HTTP */
  if (str.startsWith("http://")) {
    return str.replace("http://", "https://");
  }

  /* HTTPS */
  if (str.startsWith("https://")) {
    return str;
  }

  return defaultImg;
}

/* =========================================================
   HOME COMPONENT
   ========================================================= */

function Home({ search = "" }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [heroMovies, setHeroMovies] = useState(FALLBACK_MOVIES.slice(0, 5));
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [heroIndex, setHeroIndex] = useState(0);

  /* =======================================================
     LOAD MOVIES FROM API
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadMovies = async () => {
      try {
        const response = await axios.get(API_URL, {
          timeout: 8000,
        });

        if (!mounted) return;

        if (Array.isArray(response.data) && response.data.length > 0) {
          const formatted = response.data.map((item, idx) => {
            const defaultPoster =
              BACKUP_POSTERS[idx % BACKUP_POSTERS.length];

            const defaultBackdrop =
              BACKUP_HEROES[idx % BACKUP_HEROES.length];

            return {
              ...item,

              poster: getValidImageUrl(
                item?.poster ||
                  item?.poster_path ||
                  item?.image ||
                  item?.imageUrl,
                defaultPoster,
                "poster"
              ),

              background: getValidImageUrl(
                item?.background ||
                  item?.backdrop ||
                  item?.backdrop_path ||
                  item?.backdropUrl,
                defaultBackdrop,
                "backdrop"
              ),
            };
          });

          setMovies(formatted);
          setHeroMovies(formatted.slice(0, 5));
          setHeroIndex(0);
        }
      } catch (error) {
        console.error(
          "StreamFlix API Error — showing fallback movies:",
          error
        );

        if (mounted) {
          setMovies(FALLBACK_MOVIES);
          setHeroMovies(FALLBACK_MOVIES.slice(0, 5));
        }
      }
    };

    loadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LANGUAGE
     ======================================================= */

  const changeLanguage = (e) => {
    const selectedLang = e.target.value;

    if (
      i18n &&
      typeof i18n.changeLanguage === "function"
    ) {
      i18n.changeLanguage(selectedLang);
    }
  };

  /* =======================================================
     SEARCH
     ======================================================= */

  const searchValue = String(search).trim().toLowerCase();

  /* =======================================================
     FILTER MOVIES
     ======================================================= */

  const filteredMovies = movies.filter((movie) => {
    const title = String(
      movie?.title || movie?.name || ""
    ).toLowerCase();

    if (!title.includes(searchValue)) {
      return false;
    }

    if (
      selectedCategory === "Home" ||
      selectedCategory === "All"
    ) {
      return true;
    }

    const categoryText = [
      movie?.category,
      movie?.genre,
      movie?.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (selectedCategory === "Movies") {
      return !categoryText.includes("tv");
    }

    if (selectedCategory === "TV Shows") {
      return (
        categoryText.includes("tv") ||
        categoryText.includes("show")
      );
    }

    return categoryText.includes(
      selectedCategory.toLowerCase()
    );
  });

  /* =======================================================
     ACTIVE HERO
     ======================================================= */

  const activeHero =
    heroMovies[heroIndex] || FALLBACK_MOVIES[0];

  /* =======================================================
     MOVIE CLICK
     ======================================================= */

  const handleMovieClick = (movie) => {
    if (movie?._id && !String(movie._id).startsWith("fallback-")) {
      navigate(`/movie/${movie._id}`);
    }
  };

  /* =======================================================
     HERO NEXT
     ======================================================= */

  const nextHero = () => {
    setHeroIndex(
      (prev) =>
        (prev + 1) %
        (heroMovies.length || FALLBACK_MOVIES.length)
    );
  };

  /* =======================================================
     HERO PREVIOUS
     ======================================================= */

  const previousHero = () => {
    setHeroIndex(
      (prev) =>
        (prev - 1 + heroMovies.length) %
        (heroMovies.length || FALLBACK_MOVIES.length)
    );
  };

  return (
    <main className="sf-home">

      {/* ===================================================
          CATEGORY BAR
          =================================================== */}

      <div className="sf-categories-bar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={`sf-cat-pill ${
              selectedCategory === cat.name
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(cat.name)
            }
          >
            <span className="sf-cat-icon">
              {cat.icon}
            </span>

            {cat.name}
          </button>
        ))}
      </div>

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="sf-hero">

        <div
          className="sf-hero-bg"
          style={{
            backgroundImage: `url("${activeHero?.background}")`,
          }}
        />

        <div className="sf-hero-overlay" />

        <div className="sf-hero-content">

          <div className="sf-hero-subtag">
            A <span>STREAMFLIX</span> ORIGINAL
          </div>

          <h1 className="sf-hero-title">
            {activeHero?.title ||
              activeHero?.name ||
              "STREAMFLIX EXCLUSIVE"}
          </h1>

          <div className="sf-hero-meta">

            <span className="sf-year">
              {activeHero?.year || "2026"}
            </span>

            <span className="sf-badge-age">
              {activeHero?.rating || "16+"}
            </span>

            <span className="sf-genre">
              {activeHero?.genre || "Action"}
            </span>

            <span className="sf-dot">
              •
            </span>

            <span className="sf-duration">
              {activeHero?.duration || "2h 18m"}
            </span>

          </div>

          <p className="sf-hero-desc">
            {activeHero?.description ||
              "Watch the latest trending movies and TV shows instantly on StreamFlix."}
          </p>

          <div className="sf-hero-actions">

            <button
              type="button"
              className="sf-btn-play"
              onClick={() =>
                handleMovieClick(activeHero)
              }
            >
              ▶ Watch Now
            </button>

            <button
              type="button"
              className="sf-btn-info"
              onClick={() =>
                handleMovieClick(activeHero)
              }
            >
              ⓘ More Info
            </button>

          </div>

        </div>

        {/* HERO PREVIOUS */}

        <button
          type="button"
          className="sf-hero-nav sf-prev"
          onClick={previousHero}
          aria-label="Previous"
        >
          ❮
        </button>

        {/* HERO NEXT */}

        <button
          type="button"
          className="sf-hero-nav sf-next"
          onClick={nextHero}
          aria-label="Next"
        >
          ❯
        </button>

        {/* HERO DOTS */}

        <div className="sf-hero-dots">

          {heroMovies.map((_, idx) => (
            <button
              type="button"
              key={idx}
              aria-label={`Hero ${idx + 1}`}
              className={`sf-dot-item ${
                heroIndex === idx
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setHeroIndex(idx)
              }
            />
          ))}

        </div>

      </section>

      {/* ===================================================
          TRENDING NOW
          =================================================== */}

      <section className="sf-trending-section">

        <div className="sf-trending-header">

          <h2>
            <span className="sf-bar" />
            Trending <strong>Now</strong>
          </h2>

          <button
            type="button"
            className="sf-view-all"
            onClick={() => navigate("/movies")}
          >
            View All ❯
          </button>

        </div>

        <div className="sf-trending-grid">

          {filteredMovies
            .slice(0, 6)
            .map((movie, index) => (

              <div
                className="sf-card"
                key={movie?._id || index}
                onClick={() =>
                  handleMovieClick(movie)
                }
              >

                <div className="sf-card-poster">

                  <img
                    src={
                      movie?.poster ||
                      BACKUP_POSTERS[
                        index %
                          BACKUP_POSTERS.length
                      ]
                    }
                    alt={
                      movie?.title ||
                      movie?.name ||
                      "StreamFlix Poster"
                    }
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;

                      e.currentTarget.src =
                        BACKUP_POSTERS[
                          index %
                            BACKUP_POSTERS.length
                        ];
                    }}
                  />

                  <span className="sf-top10-tag">
                    TOP 10
                  </span>

                  <span className="sf-rank-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                </div>

              </div>

            ))}

        </div>

      </section>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="sf-footer-container">

        <p className="sf-footer-contact">
          Questions?{" "}
          <Link to="/contact">
            Contact us.
          </Link>
        </p>

        <div className="sf-footer-grid">

          <div className="sf-footer-col">
            <Link to="/faq">FAQ</Link>
            <Link to="/investors">
              Investor Relations
            </Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/speed-test">
              Speed Test
            </Link>
          </div>

          <div className="sf-footer-col">
            <Link to="/help">
              Help Center
            </Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/cookies">
              Cookie Preferences
            </Link>
            <Link to="/legal">
              Legal Notices
            </Link>
          </div>

          <div className="sf-footer-col">
            <Link to="/account">
              Account
            </Link>
            <Link to="/watch">
              Ways to Watch
            </Link>
            <Link to="/corporate">
              Corporate Information
            </Link>
            <Link to="/originals">
              Only on StreamFlix
            </Link>
          </div>

          <div className="sf-footer-col">
            <Link to="/media">
              Media Center
            </Link>
            <Link to="/terms">
              Terms of Use
            </Link>
            <Link to="/contact">
              Contact Us
            </Link>
          </div>

        </div>

        {/* LANGUAGE */}

        <div className="sf-lang-box">

          <span>🌐</span>

          <select
            onChange={changeLanguage}
            value={i18n?.language || "en"}
            className="sf-lang-select"
          >
            <option value="en">
              English
            </option>

            <option value="ur">
              اردو
            </option>

            <option value="es">
              Español
            </option>

            <option value="fr">
              Français
            </option>
          </select>

        </div>

        <p className="sf-region">
          StreamFlix Pakistan
        </p>

        <p className="sf-recaptcha">
          This page is protected by Google reCAPTCHA
          to ensure you're not a bot.
        </p>

      </footer>

    </main>
  );
}

export default Home;