
import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css";

const API_BASE =
  "https://streamflix-production-30f2.up.railway.app/api/movies";

function cleanPoster(poster) {
  if (!poster || typeof poster !== "string") {
    return "";
  }

  let value = poster.trim();

  // Markdown link:
  // [Poster](https://example.com/image.jpg)
  const markdownMatch = value.match(
    /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (markdownMatch) {
    value = markdownMatch[2].trim();
  }

  // Markdown image:
  // ![Poster](https://example.com/image.jpg)
  const imageMarkdownMatch = value.match(
    /^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/i
  );

  if (imageMarkdownMatch) {
    value = imageMarkdownMatch[2].trim();
  }

  value = value.replace(/^["']|["']$/g, "").trim();
  value = value.replace(/\\&/g, "&");
  value = value.replace(/\\\//g, "/");

  if (value.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${value}`;
  }

  if (value.startsWith("http://")) {
    return value.replace(/^http:\/\//i, "https://");
  }

  if (value.startsWith("https://")) {
    return value;
  }

  return "";
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

function MovieDetails({ addToWatchlist }) {
  const { title } = useParams();

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // =====================================
  // FETCH MOVIE DIRECTLY BY ID
  // =====================================

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        const movieId = decodeURIComponent(title);

        const res = await axios.get(
          `${API_BASE}/${movieId}`,
          {
            timeout: 10000,
          }
        );

        console.log("MOVIE DETAILS RESPONSE:", res.data);

        setMovie(res.data);
      } catch (error) {
        console.log(
          "MOVIE DETAILS ERROR:",
          error?.response?.data || error.message
        );

        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [title]);

  // =====================================
  // KEYBOARD CONTROLS
  // =====================================

  useEffect(() => {
    if (!showPlayer) {
      return;
    }

    const handleKeyDown = (event) => {
      const video = videoRef.current;

      if (event.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          closePlayer();
        }
        return;
      }

      if (!video) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();

        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }

      if (event.key === "ArrowRight") {
        video.currentTime = Math.min(
          video.currentTime + 10,
          video.duration || video.currentTime + 10
        );
      }

      if (event.key === "ArrowLeft") {
        video.currentTime = Math.max(
          video.currentTime - 10,
          0
        );
      }

      if (event.key.toLowerCase() === "m") {
        video.muted = !video.muted;
        setIsMuted(video.muted);
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showPlayer]);

  // =====================================
  // VIDEO EVENTS
  // =====================================

  useEffect(() => {
    if (!showPlayer) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(video.duration)
          ? video.duration
          : 0
      );

      setCurrentTime(video.currentTime || 0);
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      showPlayerControls();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };

    video.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    video.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    video.addEventListener(
      "play",
      handlePlay
    );

    video.addEventListener(
      "pause",
      handlePause
    );

    video.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      video.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      video.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      video.removeEventListener(
        "play",
        handlePlay
      );

      video.removeEventListener(
        "pause",
        handlePause
      );

      video.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [showPlayer]);

  // =====================================
  // PLAYER CONTROLS
  // =====================================

  const showPlayerControls = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (!videoRef.current?.paused) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    showPlayerControls();
  };

  const skip = (seconds) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = Math.max(
      0,
      Math.min(
        video.currentTime + seconds,
        video.duration ||
          video.currentTime + seconds
      )
    );
  };

  const handleProgress = (event) => {
    const video = videoRef.current;

    if (!video || !duration) {
      return;
    }

    const newTime = Number(event.target.value);

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolume = (event) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const newVolume = Number(event.target.value);

    video.volume = newVolume;
    video.muted = newVolume === 0;

    setVolume(newVolume);
    setIsMuted(video.muted);
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;

    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await player.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log(
        "FULLSCREEN ERROR:",
        error
      );
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const closePlayer = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    if (controlsTimeoutRef.current) {
      clearTimeout(
        controlsTimeoutRef.current
      );
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsVideoLoading(false);
    setVideoError(false);
    setShowControls(true);
    setShowPlayer(false);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="loading">
        <h1>Movie Loading...</h1>
      </div>
    );
  }

  // =====================================
  // NOT FOUND
  // =====================================

  if (!movie) {
    return (
      <div className="loading">
        <h1>Movie Not Found</h1>

        <Link to="/">
          <button className="back-btn">
            ← Back Home
          </button>
        </Link>
      </div>
    );
  }

  const posterUrl = cleanPoster(movie.poster);

  const hasVideo =
    movie.videoUrl &&
    movie.videoUrl !== "#" &&
    movie.videoUrl.trim() !== "";

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="movie-details-page">

      {/* MOVIE DETAILS */}

      <div className="movie-details">

        <div className="details-poster">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie"}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="poster-fallback">
              🎬
            </div>
          )}
        </div>

        <div className="details-info">

          <h1>{movie.title}</h1>

          <div className="details-meta">

            <span>
              ⭐ {movie.rating || "N/A"}
            </span>

            <span>
              {movie.category || "Movie"}
            </span>

          </div>

          <p>
            {movie.description ||
              "No description available."}
          </p>

          <div className="details-buttons">

            <button
              type="button"
              className="watch-now-btn"
              onClick={() => {
                if (hasVideo) {
                  setVideoError(false);
                  setShowPlayer(true);
                }
              }}
              disabled={!hasVideo}
            >
              {hasVideo
                ? "▶ Watch Now"
                : "Coming Soon"}
            </button>

            {addToWatchlist && (
              <button
                type="button"
                className="watchlist-btn"
                onClick={() =>
                  addToWatchlist(movie)
                }
              >
                + Watchlist
              </button>
            )}

          </div>

        </div>

      </div>

      {/* VIDEO PLAYER */}

      {showPlayer && hasVideo && (
        <div className="movie-player-overlay">

          <div
            className="movie-player"
            ref={playerRef}
            onMouseMove={showPlayerControls}
            onMouseEnter={showPlayerControls}
          >

            <div
              className={`player-top-bar ${
                showControls
                  ? "controls-visible"
                  : "controls-hidden"
              }`}
            >
              <div className="player-movie-title">
                {movie.title}
              </div>
            </div>

            <video
              ref={videoRef}
              className="video-player"
              src={movie.videoUrl}
              autoPlay
              playsInline
              onClick={togglePlay}
              onDoubleClick={toggleFullscreen}
              onLoadStart={() => {
                setIsVideoLoading(true);
                setVideoError(false);
              }}
              onCanPlay={() => {
                setIsVideoLoading(false);
              }}
              onError={() => {
                setIsVideoLoading(false);
                setVideoError(true);
              }}
            />

            {videoError && (
              <div className="player-video-error">

                <div className="player-placeholder-icon">
                  ⚠️
                </div>

                <h2>
                  Video unavailable
                </h2>

                <p>
                  This video could not be
                  loaded right now.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setVideoError(false);
                    setIsVideoLoading(true);

                    videoRef.current?.load();

                    videoRef.current
                      ?.play()
                      .catch(() => {});
                  }}
                >
                  ↻ Try Again
                </button>

              </div>
            )}

            {isVideoLoading && (
              <div className="player-loading">

                <div className="player-spinner" />

                <span>
                  Loading video...
                </span>

              </div>
            )}

            <div
              className={`custom-player-controls ${
                showControls
                  ? "controls-visible"
                  : "controls-hidden"
              }`}
            >

              <input
                className="player-progress"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleProgress}
              />

              <div className="player-controls-row">

                <div className="player-left-controls">

                  <button
                    type="button"
                    className="player-control-btn player-play-btn"
                    onClick={togglePlay}
                  >
                    {isPlaying
                      ? "❚❚"
                      : "▶"}
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={() => skip(-10)}
                  >
                    ↶ 10
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={() => skip(10)}
                  >
                    10 ↷
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={toggleMute}
                  >
                    {isMuted
                      ? "🔇"
                      : "🔊"}
                  </button>

                  <input
                    className="player-volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={
                      isMuted
                        ? 0
                        : volume
                    }
                    onChange={handleVolume}
                  />

                  <span className="player-time">
                    {formatTime(currentTime)}
                    {" / "}
                    {formatTime(duration)}
                  </span>

                </div>

                <div className="player-right-controls">

                  <button
                    type="button"
                    className="player-control-btn player-fullscreen-btn"
                    onClick={toggleFullscreen}
                  >
                    ⛶
                  </button>

                </div>

              </div>

            </div>

            <button
              type="button"
              className="player-close"
              onClick={closePlayer}
              aria-label="Close player"
            >
              ✕
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default MovieDetails;

