import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("fc27-splash-active");
    const timer = window.setTimeout(() => {
      document.body.classList.remove("fc27-splash-active");
      setVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("fc27-splash-active");
    };
  }, []);

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
