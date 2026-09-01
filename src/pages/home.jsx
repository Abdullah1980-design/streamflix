import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/trending";

/* =====================================================
   CATEGORIES
===================================================== */

const categories = [
  { name: "All", key: "all", icon: "⌂" },
  { name: "Movies", key: "movies", icon: "▶" },
  { name: "TV Shows", key: "tvShows", icon: "▣" },
  { name: "Action", key: "action", icon: "⚡" },
  { name: "Drama", key: "drama", icon: "◆" },
  { name: "Comedy", key: "comedy", icon: "☺" },
  { name: "Horror", key: "horror", icon: "☠" },
  { name: "Romance", key: "romance", icon: "♡" },
  { name: "Kids", key: "kids", icon: "★" },
  { name: "Documentary", key: "documentary", icon: "▤" },
];
/* =====================================================
   FALLBACK MOVIES
===================================================== */

const fallbackMovies = [
  {
    title: "Peaky Blinders",
    category: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
  },
  {
    title: "Money Heist",
    category: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
  },
  {
    title: "Stranger Things",
    category: "Horror",
    poster:
      "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
  },
  {
    title: "The Witcher",
    category: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiO3zzYJ6s0b6oO.jpg",
  },
  {
    title: "Lucifer",
    category: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/ekZobS8isE6mA53RAiGDG93hBXf.jpg",
  },
  {
    title: "Avengers: Endgame",
    category: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  },
  {
    title: "The Dark Knight",
    category: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    title: "Interstellar",
    category: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    title: "Inception",
    category: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
];

/* =====================================================
   HERO FALLBACK SLIDES
===================================================== */

const heroSlides = [
  {
    title: "THE LAST STAND",
    year: "2026",
    rating: "16+",
    genre: "Action",
    duration: "2h 18m",
    description:
      "In a world destroyed by chaos, one man stands between hope and extinction.",
    background:
      "https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  },
  {
    title: "AVENGERS: ENDGAME",
    year: "2019",
    rating: "13+",
    genre: "Action",
    duration: "3h 02m",
    description:
      "The Avengers make one final stand to save the universe.",
    background:
      "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
  },
  {
    title: "INTERSTELLAR",
    year: "2014",
    rating: "13+",
    genre: "Drama",
    duration: "2h 49m",
    description:
      "A journey beyond the stars becomes humanity's greatest hope.",
    background:
      "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  },
];

/* =====================================================
   CLEAN URL
===================================================== */

function cleanUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const url = value.trim();

  // Normal URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Markdown-style URL
  const markdownMatch = url.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);

  if (markdownMatch) {
    return markdownMatch[2];
  }

  return url;
}

/* =====================================================
   HOME
===================================================== */

function Home({ search = "" }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  /* ===================================================
     STATE
  =================================================== */

  const [movies, setMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  /* LANGUAGE */
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  /* ===================================================
     CHANGE LANGUAGE
  =================================================== */

  const changeLanguage = (language, code) => {
    setSelectedLanguage(language);
    setLanguageOpen(false);
    i18n.changeLanguage(code);
  };

  /* ===================================================
     LOAD TRENDING MOVIES
  =================================================== */

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      try {
        const response = await axios.get(API_URL, {
          timeout: 8000,
        });

        if (
          active &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const latestMovies = response.data.slice(0, 10);

          setMovies(latestMovies);

          const heroes = latestMovies.slice(0, 3).map((movie) => ({
            ...movie,
            background:
              cleanUrl(movie?.background) ||
              cleanUrl(movie?.backdrop) ||
              cleanUrl(movie?.backdrop_path) ||
              cleanUrl(movie?.poster),
          }));

          setHeroMovies(heroes);
        }
      } catch (error) {
        console.log("Trending API unavailable.");
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, []);

  /* ===================================================
     RESET HERO INDEX
  =================================================== */

  useEffect(() => {
    setHeroIndex(0);
  }, [heroMovies.length]);

  /* ===================================================
     HERO SLIDER
  =================================================== */

  const totalSlides = heroMovies.length || heroSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % totalSlides);
    }, 6000);

    return () => {
      clearInterval(timer);
    };
  }, [totalSlides]);

  /* ===================================================
     DISPLAY MOVIES
  =================================================== */

  const displayMovies = movies.length > 0 ? movies : fallbackMovies;

  /* ===================================================
     ACTIVE HERO
  =================================================== */

  const activeHero =
    heroMovies.length > 0
      ? heroMovies[heroIndex] || heroMovies[0]
      : heroSlides[heroIndex] || heroSlides[0];

  /* ===================================================
     SEARCH + CATEGORY FILTER
  =================================================== */

  const searchValue = String(search).trim().toLowerCase();

  const filteredMovies = displayMovies.filter((movie) => {
    const title = String(movie?.title || "").toLowerCase();

    /* SEARCH */
    if (!title.includes(searchValue)) {
      return false;
    }

    /* ALL */
    if (selectedCategory === "All") {
      return true;
    }

    const category = String(
      movie?.category ||
        movie?.genre ||
        movie?.type ||
        ""
    ).toLowerCase();

    const selected = selectedCategory.toLowerCase();

    /* MOVIES */
    if (selected === "movies") {
      return !category.includes("tv");
    }

    /* TV SHOWS */
    if (selected === "tv shows") {
      return category.includes("tv");
    }

    /* OTHER CATEGORIES */
    return category.includes(selected);
  });

  /* ===================================================
     MOVIE CLICK
  =================================================== */

  function handleMovieClick(movie) {
    if (movie?._id) {
      navigate(`/movie/${movie._id}`);
    }
  }

  /* ===================================================
     HERO WATCH BUTTON
  =================================================== */

  function handlePlay() {
    if (activeHero?._id) {
      navigate(`/movie/${activeHero._id}`);
      return;
    }

    document.querySelector(".trending")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  /* ===================================================
     HERO INFO BUTTON
  =================================================== */

  function handleInfo() {
    if (activeHero?._id) {
      navigate(`/movie/${activeHero._id}`);
      return;
    }

    navigate("/movies");
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <>
      <main className="home-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div
            className="hero-image"
            key={cleanUrl(activeHero?.background)}
            style={{
              backgroundImage: `url("${cleanUrl(
                activeHero?.background
              )}")`,
            }}
          />

          <div className="hero-vignette" />
          <div className="hero-red-glow" />

          <div className="hero-content">

            <div className="hero-brand">
              <span>STREAM</span>
              <strong>FLIX</strong>
            </div>

            <div className="original-label">
              <i />
              A STREAMFLIX ORIGINAL
            </div>

            <h1 className="hero-title">
              {activeHero?.title || "THE LAST STAND"}
            </h1>

            <div className="hero-meta">

              <span>
                {activeHero?.year || "2026"}
              </span>

              <span>
                {activeHero?.rating || "18+"}
              </span>

              <span>
                {activeHero?.genre ||
                  activeHero?.category ||
                  "Action"}
              </span>

              <span>
                {activeHero?.duration || "2h 18m"}
              </span>

            </div>

            <p className="hero-tagline">
              Unlimited Movies, Series & Entertainment
            </p>

            <p className="hero-description">
              {activeHero?.description ||
                "Discover the latest movies and shows on StreamFlix."}
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="play-button"
                onClick={handlePlay}
              >
                <span>▶</span>
                {t("watchNow", "Watch Now")}
              </button>

              <button
                type="button"
                className="info-button"
                onClick={handleInfo}
              >
                <span>ⓘ</span>
                {t("moreInfo", "More Info")}
              </button>

            </div>

          </div>

          {/* HERO DOTS */}

          <div className="hero-dots">

            {Array.from({
              length: totalSlides,
            }).map((_, index) => (
              <button
                type="button"
                key={index}
                className={
                  heroIndex === index ? "active" : ""
                }
                onClick={() => setHeroIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

          </div>

          {/* HERO SCROLL */}

          <div className="hero-scroll">
            <span />
            {t("scrollToExplore", "SCROLL TO EXPLORE")}
          </div>

        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="categories-section">

          <div className="section-container">

            <div className="section-mini-title">
              {t("browse", "BROWSE")}
            </div>

            <div className="category-list">

              {categories.map((category) => (

                <button
                  type="button"
                  key={category.name}
                  className={
                    selectedCategory === category.name
                      ? "category-card active"
                      : "category-card"
                  }
                  onClick={() =>
                    setSelectedCategory(category.name)
                  }
                >

                  <span className="category-icon">
                    {category.icon}
                  </span>

                <span className="category-name">
  {t(category.key, category.name)}
</span>

                </button>

              ))}

            </div>

          </div>

        </section>

        {/* =================================================
            TRENDING
        ================================================= */}

        <section className="trending">

          <div className="section-container">

            <div className="section-header">

              <div>

                <div className="discover">
                  {t("discover", "DISCOVER")}
                </div>

                <h2>
                  {t("trending", "Trending")}{" "}
                  <span>{t("now", "Now")}</span>
                </h2>

              </div>

              <button
                type="button"
                className="view-all"
                onClick={() => navigate("/movies")}
              >
                {t("viewAll", "View All")} <b>›</b>
              </button>

            </div>

            {/* MOVIE GRID */}

            {filteredMovies.length > 0 ? (

              <div className="movie-grid">

                {filteredMovies.map((movie, index) => (

                  <article
                    className="movie-card"
                    key={
                      movie?._id ||
                      `${movie?.title}-${index}`
                    }
                    onClick={() =>
                      handleMovieClick(movie)
                    }
                  >

                    <div className="movie-poster">

                      <img
                        src={cleanUrl(movie?.poster)}
                        alt={
                          movie?.title || "Movie"
                        }
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.opacity =
                            "0";
                        }}
                      />

                      <div className="poster-gradient" />

                      <span className="top-ten">
                        TOP 10
                      </span>

                      <span className="movie-rank">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <button
                        type="button"
                        className="poster-play"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMovieClick(movie);
                        }}
                        aria-label={`Play ${
                          movie?.title || "movie"
                        }`}
                      >
                        ▶
                      </button>

                    </div>

                    <h3>
                      {movie?.title || "Untitled"}
                    </h3>

                  </article>

                ))}

              </div>

            ) : (

              /* NO RESULTS */

              <div className="no-results">

                <div className="no-results-icon">
                  ⌕
                </div>

                <h3>
                  {t("noMoviesFound", "No movies found")}
                </h3>

                <p>
                  {t(
                    "tryAnotherMovie",
                    "Try searching for another movie."
                  )}
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      {/* =================================================
          STREAMFLIX FOOTER
      ================================================= */}

      <footer className="streamflix-footer">

        <div className="footer-container">

          <p className="footer-question">
            {t(
              "footerQuestion",
              "Ready to watch? Enter your email to create or restart your membership."
            )}
          </p>

          <p className="footer-contact">
            {t(
              "footerContact",
              "Questions? Contact StreamFlix Support."
            )}
          </p>

          {/* FOOTER LINKS */}

          <div className="footer-links">

            <Link to="/faq">
              {t("faq", "FAQ")}
            </Link>

            <Link to="/help">
              {t("helpCenter", "Help Center")}
            </Link>

            <Link to="/profile">
              {t("account", "Account")}
            </Link>

            <Link to="/media">
              {t("mediaCenter", "Media Center")}
            </Link>

            <Link to="/careers">
              {t("careers", "Careers")}
            </Link>

            <Link to="/watch">
              {t("waysToWatch", "Ways to Watch")}
            </Link>

            <Link to="/terms">
              {t("terms", "Terms of Use")}
            </Link>

            <Link to="/privacy">
              {t("privacy", "Privacy")}
            </Link>

            <Link to="/cookies">
              {t(
                "cookiePreferences",
                "Cookie Preferences"
              )}
            </Link>

            <Link to="/contact">
              {t("contactUs", "Contact Us")}
            </Link>

            <Link to="/legal">
              {t("legalNotices", "Legal Notices")}
            </Link>

            <Link to="/about">
              {t("aboutStreamflix", "About StreamFlix")}
            </Link>

          </div>

          {/* =================================================
              LANGUAGE SELECTOR
          ================================================= */}

          <div className="footer-language">

            <button
              type="button"
              className="language-button"
              onClick={() =>
                setLanguageOpen((prev) => !prev)
              }
              aria-expanded={languageOpen}
              aria-haspopup="listbox"
            >
              🌐 {selectedLanguage}
            </button>

            {languageOpen && (

              <div
                className="language-dropdown"
                role="listbox"
              >

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("English", "en")
                  }
                >
                  🇺🇸 English
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("اردو", "ur")
                  }
                >
                  🇵🇰 اردو
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("Español", "es")
                  }
                >
                  🇪🇸 Español
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("Français", "fr")
                  }
                >
                  🇫🇷 Français
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("Deutsch", "de")
                  }
                >
                  🇩🇪 Deutsch
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("العربية", "ar")
                  }
                >
                  🇸🇦 العربية
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("हिन्दी", "hi")
                  }
                >
                  🇮🇳 हिन्दी
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("中文", "zh")
                  }
                >
                  🇨🇳 中文
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("日本語", "ja")
                  }
                >
                  🇯🇵 日本語
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("한국어", "ko")
                  }
                >
                  🇰🇷 한국어
                </button>

              </div>

            )}

          </div>

          {/* =================================================
              FOOTER BOTTOM
          ================================================= */}

          <div className="footer-bottom">

            <p className="footer-brand">

              <span>STREAM</span>

              <strong>FLIX</strong>

              <small>Pakistan</small>

            </p>

            <p className="footer-copy">
              © 2026 StreamFlix.{" "}
              {t(
                "allRightsReserved",
                "All rights reserved."
              )}
            </p>

          </div>

          <p className="footer-security">
            {t(
              "securityMessage",
              "This page is protected to help keep StreamFlix secure."
            )}
          </p>

        </div>

      </footer>
    </>
  );
}

export default Home;