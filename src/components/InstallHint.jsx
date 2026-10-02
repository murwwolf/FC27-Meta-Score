import { useState } from "react";

const DISMISSAL_KEY = "fc27-meta-score:install-hint-dismissed";

function isIOSBrowserSafari() {
  const userAgent = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  const isInstalled = navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;

  return isIOS && isSafari && !isInstalled;
}

function InstallHint() {
  const [visible, setVisible] = useState(() => {
    if (!isIOSBrowserSafari()) return false;
    try {
      return window.localStorage.getItem(DISMISSAL_KEY) !== "true";
    } catch {
      return true;
    }
  });

  function dismissHint() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSAL_KEY, "true");
    } catch {
      // Dismissal still applies for the current visit.
    }
  }

  if (!visible) return null;

  return (
    <aside className="ios-install-hint" aria-label="Install FC27 META SCORE">
      <div className="ios-install-hint-icon" aria-hidden="true">FC</div>
      <div className="ios-install-hint-copy">
        <strong>ADD TO YOUR HOME SCREEN</strong>
        <p>Add FC27 META SCORE to your Home Screen using Safari's Share menu <span aria-hidden="true">→</span> Add to Home Screen.</p>
      </div>
      <button type="button" onClick={dismissHint} aria-label="Dismiss install instructions">×</button>
    </aside>
  );
}

export default InstallHint;
