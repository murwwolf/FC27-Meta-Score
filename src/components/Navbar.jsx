function Navbar({ page, setPage, onHome }) {
  const navItems = [
    ["home", "HOME"],
    ["meta-score", "META SCORE"],
    ["players", "PLAYERS"],
    ["rankings", "RANKINGS"],
    ["compare", "COMPARE"],
  ];
  const mobileItems = [
    ["home", "Home", "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z"],
    ["players", "Players", "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0m2 2a4 4 0 0 1 4 4v1m-2-11a4 4 0 0 1 0 8"],
    ["rankings", "Rankings", "M4 19V9m8 10V5m8 14v-7M2 21h20"],
    ["compare", "Compare", "M7 7h14m0 0-4-4m4 4-4 4M17 17H3m0 0 4-4m-4 4 4 4"],
  ];

  return (
    <>
      <nav className="navbar">
        <button
          className="brand"
          onClick={onHome}
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
                setPage(value);
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
              onClick={() => value === "home" ? onHome() : setPage(value)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={icon} />
              </svg>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Navbar;
