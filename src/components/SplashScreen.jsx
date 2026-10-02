import { useEffect, useLayoutEffect, useState } from "react";

const SPLASH_DURATION_MS = 2300;
const SPLASH_FADE_MS = 380;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useLayoutEffect(() => {
    if (!visible) return undefined;

    document.body.classList.add("fc27-splash-active");
    const backgroundElements = [
      document.querySelector(".app"),
      document.querySelector(".ios-install-hint"),
    ].filter(Boolean);
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    document.querySelector(".fc27-splash")?.focus();

    return () => {
      document.body.classList.remove("fc27-splash-active");
      backgroundElements.forEach((element) => {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      });
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    const fadeTimer = window.setTimeout(() => setIsLeaving(true), SPLASH_DURATION_MS);
    const hideTimer = window.setTimeout(() => setVisible(false), SPLASH_DURATION_MS + SPLASH_FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`fc27-splash${isLeaving ? " fc27-splash--fade" : ""}`} role="dialog" aria-modal="true" aria-labelledby="fc27-splash-title" tabIndex={-1}>
      <div className="fc27-splash-glow" aria-hidden="true" />
      <div className="fc27-splash-content">
        <div className="fc27-splash-logo">
          <img src="/logo.png" alt="" width="320" height="214" />
        </div>
        <h1 id="fc27-splash-title">FC27 META SCORE</h1>
        <p>ULTIMATE TEAM DATABASE</p>
        <div className="fc27-splash-loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
