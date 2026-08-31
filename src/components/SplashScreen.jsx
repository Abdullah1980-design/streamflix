import "../App.css";
import "./SplashScreen.css";
import { useEffect, useRef, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(1);
  const staticSound = useRef(null);

  useEffect(() => {
    staticSound.current = new Audio("/sounds/tv-static.mp3");
    staticSound.current.volume = 0.35;
  }, []);

  useEffect(() => {
    const timers = [
      // TV arrives
      setTimeout(() => setStage(2), 700),

      // TV signal sound + logo appears
      setTimeout(() => {
        setStage(3);

        if (staticSound.current) {
          staticSound.current.currentTime = 0;
          staticSound.current.play().catch(() => {});
        }
      }, 1400),

      // SF separates
      setTimeout(() => setStage(4), 2100),

      // TREAM + LIX reveal
      setTimeout(() => setStage(5), 2900),

      // Final STREAMFLIX
      setTimeout(() => setStage(6), 3700),

      // Finish
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 4500),
    ];

    return () => {
      timers.forEach(clearTimeout);

      if (staticSound.current) {
        staticSound.current.pause();
        staticSound.current.currentTime = 0;
      }
    };
  }, [onFinish]);

  return (
    <div className="streamflix-splash">

      {/* Cinematic background */}
      <div className="red-glow glow-one"></div>
      <div className="red-glow glow-two"></div>

      {/* TV */}
      <div className={`retro-tv stage-${stage}`}>

        {/* Antennas */}
        <div className="antenna antenna-left"></div>
        <div className="antenna antenna-right"></div>

        {/* TV body */}
        <div className="tv-body">

          {/* TV top highlight */}
          <div className="tv-highlight"></div>

          {/* Screen */}
          <div className="tv-screen">

            {/* CRT glass */}
            <div className="crt-glass"></div>

            {/* Scanlines */}
            <div className="scanlines"></div>

            {/* Signal distortion */}
            <div
              className={`signal-distortion ${
                stage === 2 || stage === 3 ? "active" : ""
              }`}
            ></div>

            {/* Static */}
            <div
              className={`static-noise ${
                stage === 2 ? "active" : ""
              }`}
            >
              {Array.from({ length: 80 }).map((_, i) => (
                <span key={i}></span>
              ))}
            </div>

            {/* SF → STREAMFLIX */}
            <div
              className={`sf-transform ${
                stage >= 3 ? "show" : ""
              } ${
                stage >= 4 ? "split" : ""
              } ${
                stage >= 5 ? "reveal" : ""
              } ${
                stage >= 6 ? "complete" : ""
              }`}
            >

              {/* S + TREAM */}
              <div className="logo-left">
                <span className="logo-s">S</span>

                <span className="hidden-word tream">
                  TREAM
                </span>
              </div>

              {/* F + LIX */}
              <div className="logo-right">
                <span className="logo-f">F</span>

                <span className="hidden-word lix">
                  LIX
                </span>
              </div>

            </div>

            {/* Tagline */}
            <div
              className={`streamflix-tagline ${
                stage === 6 ? "active" : ""
              }`}
            >
              Your World of Entertainment
            </div>

          </div>

          {/* Controls */}
          <div className="tv-controls">

            <div className="control-label">
              POWER
            </div>

            <div className="knob knob-large"></div>

            <div className="knob knob-small"></div>

            <div className="power-light"></div>

          </div>

        </div>

        {/* TV legs */}
        <div className="tv-leg leg-left"></div>
        <div className="tv-leg leg-right"></div>

      </div>

      {/* Next */}
      {stage === 6 && (
        <div className="next-login">
          <span className="profile-icon">●</span>
          <span>NEXT: SIGN IN PAGE</span>
        </div>
      )}

    </div>
  );
}
