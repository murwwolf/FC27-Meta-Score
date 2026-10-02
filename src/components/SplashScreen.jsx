import { useEffect, useState } from "react";

const SPLASH_SEEN_KEY = "fc27-meta-score:splash-seen";
const SPLASH_DURATION_MS = 1200;

function hasSeenSplash() {
  try {
    return window.localStorage.getItem(SPLASH_SEEN_KEY) === "true";
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") return false;
    throw error;
  }
}

function markSplashSeen() {
  try {
    window.localStorage.setItem(SPLASH_SEEN_KEY, "true");
  } catch (error) {
    if (error instanceof DOMException && ["QuotaExceededError", "SecurityError"].includes(error.name)) return;
    throw error;
  }
}

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => !hasSeenSplash());

  useEffect(() => {
    if (!visible) return undefined;

    markSplashSeen();
    document.body.classList.add("fc27-splash-active");
    const timer = window.setTimeout(() => {
      document.body.classList.remove("fc27-splash-active");
      setVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("fc27-splash-active");
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fc27-splash" role="dialog" aria-modal="true" aria-labelledby="fc27-splash-title">
      <div className="fc27-splash-glow" aria-hidden="true" />
      <div className="fc27-splash-content">
        <div className="fc27-splash-logo">
          <img src="/logo.png" alt="" />
        </div>
        <h1 id="fc27-splash-title">FC27 META SCORE</h1>
        <p>ULTIMATE TEAM DATABASE</p>
        <div className="fc27-splash-loader" role="progressbar" aria-label="Loading FC27 META SCORE" aria-valuetext="Loading">
          <span />
        </div>
      </div>
    </div>
  );
}
