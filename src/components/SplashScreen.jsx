import React, { useEffect } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 4200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">

      {/* Cinematic background light */}
      <div className="splash-light" />

      <div className="splash-stage">

        {/* =================================================
            TV
            Center se enter → smoothly left side par settle
        ================================================= */}

        <div className="intro-tv">

          {/* Antennas */}
          <div className="antenna antenna-left" />
          <div className="antenna antenna-right" />

          {/* TV BODY */}
          <div className="tv-body">

            {/* TV SCREEN */}
            <div className="tv-screen">

              {/* Old TV startup effect */}
              <div className="screen-flicker" />

              {/* Red cinematic glow */}
              <div className="screen-glow" />

              {/* =================================================
                  STREAMFLIX S
                  Sirf TV ke andar
              ================================================= */}

              <div className="s-logo">

                <div className="s-ribbon s-ribbon-top" />

                <div className="s-ribbon s-ribbon-bottom" />

                <div className="s-highlight" />

              </div>

              {/* Screen light sweep */}
              <div className="screen-shine" />

            </div>

            {/* TV controls */}
            <div className="tv-controls">
              <span />
              <span />
            </div>

          </div>

          {/* TV feet */}
          <div className="tv-feet">
            <i />
            <i />
          </div>

        </div>


        {/* =================================================
            STREAMFLIX
            TV ke BAHAR right side par
        ================================================= */}

        <div className="external-brand">

          <div className="external-brand-title">

            <span>STREAM</span>
            <strong>FLIX</strong>

          </div>

          {/* Entertainment lines */}
          <div className="external-brand-lines">

            <span>
              MOVIES • ANIME • SPORTS
            </span>

            <span>
              Entertainment made for you
            </span>

          </div>

        </div>


        {/* =================================================
            FINAL TAGLINE
        ================================================= */}

        <div className="intro-tagline">
          YOUR SCREEN. YOUR STORIES.
        </div>

      </div>

    </div>
  );
}