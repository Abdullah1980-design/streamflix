import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/trending";

/* =========================================================
   STREAMFLIX — RELIABLE FALLBACK IMAGES
   ========================================================= */

const BACKUP_POSTERS = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&h=750&q=85",
];

const SPORTS_POSTERS = [
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=500&h=750&q=85",
  "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=500&h=750&q=85",
];

const BACKUP_HEROES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&h=900&q=90",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&h=900&q=90",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&h=900&q=90",
];

/* =========================================================
   FALLBACK MOVIES
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

  /* Remove normal Markdown:
     [text](https://example.com/image.jpg)
  */
  const markdownMatch = str.match(
    /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (markdownMatch) {
    str = markdownMatch[2].trim();
  }

  /* Remove Markdown image:
     ![text](https://example.com/image.jpg)
  */
  const imageMarkdownMatch = str.match(
    /^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (imageMarkdownMatch) {
    str = imageMarkdownMatch[2].trim();
  }

  /* Remove quotes */
  str = str.replace(/^["']|["']$/g, "").trim();

  /* IMPORTANT:
     Railway currently sends placehold.co URLs.
     Treat them as invalid and use our fallback.
  */
  const lower = str.toLowerCase();

  if (
    lower.includes("placehold.co") ||
    lower.includes("placeholder.com") ||
    lower.includes("via.placeholder.com") ||
    lower.includes("placehold.it")
  ) {
    return defaultImg;
  }

  /* TMDB full URL */
  if (str.includes("image.tmdb.org")) {
    return str.replace(/^http:\/\//i, "https://");
  }

  /* TMDB relative path */
  if (str.startsWith("/")) {
    const size = type === "backdrop" ? "original" : "w500";
    return `https://image.tmdb.org/t/p/${size}${str}`;
  }

  /* HTTP */
  if (str.startsWith("http://")) {
    return str.replace(/^http:\/\//i, "https://");
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
  const [heroMovies, setHeroMovies] = useState(
    FALLBACK_MOVIES.slice(0, 5)
  );
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

        if (
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const formatted = response.data.map((item, idx) => {
            const categoryText = [
              item?.category,
              item?.genre,
              item?.type,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const isSports = categoryText.includes("sport");

            const posterFallback = isSports
              ? SPORTS_POSTERS[idx % SPORTS_POSTERS.length]
              : BACKUP_POSTERS[idx % BACKUP_POSTERS.length];

            const defaultBackdrop =
              BACKUP_HEROES[idx % BACKUP_HEROES.length];

            return {
              ...item,

              poster: getValidImageUrl(
                item?.poster ||
                  item?.poster_path ||
                  item?.image ||
                  item?.imageUrl,
                posterFallback,
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
          setHeroIndex(0);
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
    if (
      movie?._id &&
      !String(movie._id).startsWith("fallback-")
    ) {
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
    const total =
      heroMovies.length || FALLBACK_MOVIES.length;

    setHeroIndex(
      (prev) => (prev - 1 + total) % total
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

            <span className="sf-dot">•</span>

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
                heroIndex === idx ? "active" : ""
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
            .map((movie, index) => {
              const categoryText = [
                movie?.category,
                movie?.genre,
                movie?.type,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              const isSports =
                categoryText.includes("sport");

              const cardFallback = isSports
                ? SPORTS_POSTERS[
                    index % SPORTS_POSTERS.length
                  ]
                : BACKUP_POSTERS[
                    index % BACKUP_POSTERS.length
                  ];

              return (
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
                        movie?.poster || cardFallback
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
                          cardFallback;
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
              );
            })}
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
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
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