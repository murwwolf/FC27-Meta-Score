import { useState } from "react";

function Navbar({ page, setPage, onHome, onSignUp }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const navItems = [
    ["home", "HOME"],
    ["meta-score", "METHODOLOGY"],
    ["players", "PLAYERS"],
    ["meta-finder", "META FINDER"],
    ["favourites", "FAVOURITES"],
    ["rankings", "RANKINGS"],
    ["compare", "COMPARE"],
  ];
  const mobileItems = [
    ["home", "Home", "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z"],
    ["players", "Players", "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0m2 2a4 4 0 0 1 4 4v1m-2-11a4 4 0 0 1 0 8"],
    ["rankings", "Rankings", "M4 19V9m8 10V5m8 14v-7M2 21h20"],
  ];
  const toolItems = [
    ["meta-finder", "META Finder"],
    ["favourites", "Favourites"],
    ["compare", "Compare"],
    ["meta-score", "Methodology"],
    ["sign-up", "SIGN UP"],
  ];
  const toolsActive = ["meta-finder", "favourites", "compare", "meta-score"].includes(page);

  function navigateTo(value) {
    setPage(value);
    setToolsOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <button
          className="brand"
          onClick={() => {
            setToolsOpen(false);
            onHome();
          }}
          type="button"
        >
          <span className="brand-fc">FC27</span>
          <span className="brand-meta">META</span>
        </button>

        <div className="nav-links">
          {navItems.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={page === value || (page === "player" && value === "players") ? "active" : ""}
              aria-current={page === value || (page === "player" && value === "players") ? "page" : undefined}
              onClick={() => {
                navigateTo(value);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="nav-status">
          <span className="status-dot" />
          LIVE DATABASE
        </div>
        <button className="signup-nav-button" type="button" onClick={onSignUp}>
          SIGN UP
        </button>
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        {mobileItems.map(([value, label, icon]) => {
          const active = page === value || (page === "player" && value === "players");
          return (
            <button
              key={value}
              type="button"
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              onClick={() => value === "home" ? (onHome(), setToolsOpen(false)) : navigateTo(value)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={icon} />
              </svg>
              <span>{label}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={toolsActive ? "active" : ""}
          aria-expanded={toolsOpen}
          aria-controls="mobile-tools-menu"
          aria-label="More tools"
          onClick={() => setToolsOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>TOOLS</span>
        </button>
      </nav>
      {toolsOpen ? (
        <nav id="mobile-tools-menu" className="mobile-tools-menu" aria-label="More app pages">
          {toolItems.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={page === value ? "active" : ""}
              aria-current={page === value ? "page" : undefined}
              onClick={() => {
                if (value === "sign-up") {
                  setToolsOpen(false);
                  onSignUp();
                  return;
                }
                navigateTo(value);
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      ) : null}
    </>
  );
}

export default Navbar;
