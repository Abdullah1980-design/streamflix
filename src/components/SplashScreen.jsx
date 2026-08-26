import "./SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-screen">

      {/* Cinematic Stars */}
      <div className="stars">
        {Array.from({ length: 35 }).map((_, index) => (
          <span key={index} className="star"></span>
        ))}
      </div>

      {/* TV */}
      <div className="tv-wrapper">

        <div className="tv">

          {/* TV Screen */}
          <div className="tv-screen">

            <div className="screen-glow"></div>

            <div className="streamflix-logo">
              STREAM<span>FLIX</span>
            </div>

          </div>

          {/* TV Frame */}
          <div className="tv-bottom"></div>

        </div>

        {/* TV Legs */}
        <div className="tv-leg left"></div>
        <div className="tv-leg right"></div>

      </div>

    </div>
  );
}

export default SplashScreen;