function Navbar({ page, setPage, onHome }) {
  const navItems = [
    ["home", "HOME"],
    ["players", "PLAYERS"],
    ["rankings", "RANKINGS"],
    ["compare", "COMPARE"],
  ];

  return (
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
  );
}

export default Navbar;
