import { useEffect, useRef, useState } from "react";

export default function SplashScreen() {
  const continueButtonRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return undefined;

    document.body.classList.add("fc27-splash-active");
    const timer = window.setTimeout(() => setVisible(false), 10000);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setVisible(false);
      if (event.key === "Tab") {
        event.preventDefault();
        continueButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
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
        <button ref={continueButtonRef} type="button" className="fc27-splash-continue" autoFocus onClick={() => setVisible(false)}>
          CONTINUE TO APP
        </button>
      </div>
    </div>
  );
}
