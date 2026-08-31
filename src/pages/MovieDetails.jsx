import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css";

const API_URL =
  "https://streamflix-production-30f2.up.railway.app/api/movies/search";
function getCleanPoster(poster) {
  if (!poster || typeof poster !== "string") {
    return "";
  }

  const value = poster.trim();

  if (value.startsWith("[") && value.includes("](")) {
    const match = value.match(
      /^\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)$/
    );

    if (match && match[2]) {
      return match[2];
    }

    const simpleMatch = value.match(
      /\((https?:\/\/[^)]+)\)/
    );

    if (simpleMatch && simpleMatch[1]) {
      return simpleMatch[1];
    }
  }

  return value;
}

function formatTime(seconds) {
if (!Number.isFinite(seconds) || seconds < 0) {
return "00:00";
}

const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
const secs = Math.floor(seconds % 60);

if (hours > 0) {
return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
}

return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

function MovieDetails({ addToWatchlist }) {
const { title } = useParams();

const videoRef = useRef(null);
const playerRef = useRef(null);

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
const controlsTimeoutRef = useRef(null);

useEffect(() => {
const fetchMovie = async () => {
try {
const movieTitle = decodeURIComponent(title);

    const res = await axios.get(API_URL, {
      params: {
        title: movieTitle,
      },
      timeout: 8000,
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      setMovie(res.data[0]);
    } else {
      setMovie(null);
    }
  } catch (err) {
    console.log("MOVIE DETAILS ERROR:", err);
    setMovie(null);
  } finally {
    setLoading(false);
  }
};

fetchMovie();


}, [title]);

useEffect(() => {
if (!showPlayer) {
return;
}


const handleKeyDown = (event) => {
if (event.key === "Escape") {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    closePlayer();
  }
  return;
}
  const video = videoRef.current;

  if (!video) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();

    if (video.paused) {
      video.play();
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
    video.currentTime = Math.max(video.currentTime - 10, 0);
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
  window.removeEventListener("keydown", handleKeyDown);
};


}, [showPlayer]);

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
  const videoDuration = Number.isFinite(video.duration)
    ? video.duration
    : 0;

  setDuration(videoDuration);
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
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("play", handlePlay);
video.addEventListener("pause", handlePause);
video.addEventListener("ended", handleEnded);

return () => {
  video.removeEventListener("timeupdate", handleTimeUpdate);
  video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  video.removeEventListener("play", handlePlay);
  video.removeEventListener("pause", handlePause);
  video.removeEventListener("ended", handleEnded);
};


}, [showPlayer]);
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
    video.play();
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
    video.duration || video.currentTime + seconds
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
    console.log("FULLSCREEN ERROR:", error);
  }
};

useEffect(() => {
const handleFullscreenChange = () => {
setIsFullscreen(Boolean(document.fullscreenElement));
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
    clearTimeout(controlsTimeoutRef.current);
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
if (loading) {
return <div className="loading">Movie Loading...</div>;
}

if (!movie) {
return ( <div className="loading"> <h1>Movie Not Found</h1>


    <Link to="/">
      <button className="back-btn">
        ← Back Home
      </button>
    </Link>
  </div>
);


}

const posterUrl = getCleanPoster(movie.poster);

return ( <div className="movie-details-page">
{/* MOVIE DETAILS */}

  <div className="movie-details">
    <div className="details-poster">
      <img
        src={posterUrl}
        alt={movie.title || "Movie"}
        onError={(event) => {
          console.log(
            "DETAIL POSTER FAILED:",
            posterUrl
          );

          event.currentTarget.style.display = "none";
        }}
      />
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
          onClick={() => setShowPlayer(true)}
        >
          ▶ Watch Now
        </button>

        {addToWatchlist && (
          <button
            type="button"
            className="watchlist-btn"
            onClick={() => addToWatchlist(movie)}
          >
            + Watchlist
          </button>
        )}
      </div>
    </div>
  </div>

  {/* PREMIUM VIDEO PLAYER */}

  {showPlayer && (
    <div className="movie-player-overlay">
<div
  className="movie-player"
  ref={playerRef}
  onMouseMove={showPlayerControls}
  onMouseEnter={showPlayerControls}
>
  <div
    className={`player-top-bar ${
      showControls ? "controls-visible" : "controls-hidden"
    }`}
  >
    <div className="player-movie-title">
      {movie.title}
    </div>
  </div>
<video
  ref={videoRef}
  className="video-player"
  src={
    movie.videoUrl && movie.videoUrl !== "#"
      ? movie.videoUrl
      : undefined
  }
  autoPlay
  playsInline
  onClick={togglePlay}
  onDoubleClick={toggleFullscreen}
  onLoadStart={() => {
    setIsVideoLoading(true);
    setVideoError(false);
  }}
  onCanPlay={() => setIsVideoLoading(false)}
  onError={() => {
    setIsVideoLoading(false);
    setVideoError(true);
  }}
/>
{videoError && (
  <div className="player-video-error">
    <div className="player-placeholder-icon">⚠️</div>
    <h2>Video unavailable</h2>
    <p>
      This video could not be loaded right now.
    </p>
    <button
      type="button"
      onClick={() => {
        setVideoError(false);
        setIsVideoLoading(true);
        videoRef.current?.load();
        videoRef.current?.play().catch(() => {});
      }}
    >
      ↻ Try Again
    </button>
  </div>
)}

{isVideoLoading && (
  <div className="player-loading">
    <div className="player-spinner"></div>
    <span>Loading video...</span>
  </div>
)}
        {(!movie.videoUrl ||
          movie.videoUrl === "#") && (
          <div className="player-placeholder">
            <div className="player-placeholder-icon">
              🎬
            </div>

            <h2>Coming Soon</h2>

            <p>
              Video is not available for this
              movie yet.
            </p>
          </div>
        )}

        {movie.videoUrl &&
          movie.videoUrl !== "#" && (
       <div
  className={`custom-player-controls ${
    showControls ? "controls-visible" : "controls-hidden"
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
                aria-label="Video progress"
              />

              <div className="player-controls-row">
                <div className="player-left-controls">
                  <button
                    type="button"
                    className="player-control-btn player-play-btn"
                    onClick={togglePlay}
                    aria-label={
                      isPlaying
                        ? "Pause"
                        : "Play"
                    }
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={() => skip(-10)}
                    aria-label="Rewind 10 seconds"
                  >
                    ↶ 10
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={() => skip(10)}
                    aria-label="Forward 10 seconds"
                  >
                    10 ↷
                  </button>

                  <button
                    type="button"
                    className="player-control-btn"
                    onClick={toggleMute}
                    aria-label={
                      isMuted
                        ? "Unmute"
                        : "Mute"
                    }
                  >
                    {isMuted ? "🔇" : "🔊"}
                  </button>

                  <input
                    className="player-volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={
                      isMuted ? 0 : volume
                    }
                    onChange={handleVolume}
                    aria-label="Volume"
                  />

                  <span className="player-time">
                    {formatTime(currentTime)} /{" "}
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="player-right-controls">
                  <button
                    type="button"
                    className="player-control-btn player-fullscreen-btn"
                    onClick={toggleFullscreen}
                    aria-label={
                      isFullscreen
                        ? "Exit fullscreen"
                        : "Fullscreen"
                    }
                  >
                    {isFullscreen ? "⛶" : "⛶"}
                  </button>
                </div>
              </div>
            </div>
          )}

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