import { useState } from "react";
import PlayerCard from "./PlayerCard";

const SORT_OPTIONS = [
  ["meta-desc", "META Score ↓"],
  ["meta-asc", "META Score ↑"],
  ["ovr-desc", "Overall ↓"],
  ["ovr-asc", "Overall ↑"],
  ["pac-desc", "PAC ↓"],
  ["pac-asc", "PAC ↑"],
  ["sho-desc", "SHO ↓"],
  ["sho-asc", "SHO ↑"],
  ["pas-desc", "PAS ↓"],
  ["pas-asc", "PAS ↑"],
  ["dri-desc", "DRI ↓"],
  ["dri-asc", "DRI ↑"],
  ["def-desc", "DEF ↓"],
  ["def-asc", "DEF ↑"],
  ["phy-desc", "PHY ↓"],
  ["phy-asc", "PHY ↑"],
  ["name-asc", "Name A-Z"],
  ["name-desc", "Name Z-A"],
];

function PlayersPage({
  players,
  totalPlayers,
  search,
  setSearch,
  position,
  setPosition,
  tier,
  setTier,
  leagueFilter,
  setLeagueFilter,
  clubFilter,
  setClubFilter,
  nationFilter,
  setNationFilter,
  cardTypeFilter,
  setCardTypeFilter,
  cardTypes,
  minRating,
  setMinRating,
  overallOptions,
  sortBy,
  setSortBy,
  positions,
  leagues,
  clubs,
  nations,
  onOpen,
  onCompare,
  onClear,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = [];

  if (search.trim()) activeFilters.push({ label: `Search: ${search.trim()}`, clear: () => setSearch("") });
  if (position !== "All") activeFilters.push({ label: `Position: ${position}`, clear: () => setPosition("All") });
  if (tier !== "All") activeFilters.push({ label: `Tier: ${tier}`, clear: () => setTier("All") });
  if (Number(minRating) > 0) activeFilters.push({ label: `Min OVR: ${minRating}`, clear: () => setMinRating("0") });
  if (clubFilter !== "All") activeFilters.push({ label: `Club: ${clubFilter}`, clear: () => setClubFilter("All") });
  if (leagueFilter !== "All") activeFilters.push({ label: `League: ${leagueFilter}`, clear: () => setLeagueFilter("All") });
  if (nationFilter !== "All") activeFilters.push({ label: `Nation: ${nationFilter}`, clear: () => setNationFilter("All") });
  if (cardTypeFilter !== "All") activeFilters.push({ label: `Card: ${cardTypeFilter}`, clear: () => setCardTypeFilter("All") });
  const filtersActive = activeFilters.length > 0;

  return (
    <main className={`players-section players-page${filtersOpen ? " filters-open" : ""}`}>
      <header className="players-page-header">
        <div className="hero-top">
          <div className="gold-line" />
          <div className="hero-label">FC27 ULTIMATE TEAM DATABASE</div>
          <div className="gold-line" />
        </div>

        <div className="players-heading-row">
          <div>
            <div className="section-label">PLAYER DATABASE</div>
            <h1>FC27 PLAYERS</h1>
            <p>Browse, search and filter the complete FC27 Ultimate Team database.</p>
          </div>
          <div className="database-counter" aria-label={`${totalPlayers} players in database`}>
            <span className="counter-number">{totalPlayers.toLocaleString()}</span>
            <span className="counter-text">PLAYERS</span>
          </div>
        </div>

        <div className="players-search-row">
          <label className="players-search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search players..."
              aria-label="Search players by name"
            />
            {search ? (
              <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>×</button>
            ) : null}
          </label>
          <button
            type="button"
            className="players-mobile-filter-button"
            aria-expanded={filtersOpen}
            aria-controls="players-filter-panel"
            onClick={() => setFiltersOpen(true)}
          >
            FILTERS{filtersActive ? ` · ${activeFilters.length}` : ""}
          </button>
        </div>
      </header>

      {filtersOpen ? (
        <button
          type="button"
          className="players-filter-backdrop"
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
        />
      ) : null}

      <section
        id="players-filter-panel"
        className={`players-filter-panel${filtersOpen ? " is-open" : ""}`}
        aria-label="Player filters"
      >
        <div className="players-filter-heading">
          <div>
            <span className="section-label">REFINE DATABASE</span>
            <h2>FILTERS</h2>
          </div>
          <button type="button" className="players-filter-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>×</button>
          <button type="button" className="players-reset-button" onClick={onClear}>RESET FILTERS</button>
        </div>

        <div className="players-filter-grid">
          <label className="players-filter-control">
            <span>POSITION</span>
            <select value={position} onChange={(event) => setPosition(event.target.value)}>
              {positions.map((item) => <option key={item} value={item}>{item === "All" ? "All Positions" : item}</option>)}
            </select>
          </label>

          <label className="players-filter-control">
            <span>META TIER</span>
            <select value={tier} onChange={(event) => setTier(event.target.value)}>
              <option value="All">All Tiers</option>
              {["S", "A", "B", "C", "D"].map((item) => <option key={item} value={item}>{item} TIER</option>)}
            </select>
          </label>

          <label className="players-filter-control">
            <span>MIN OVERALL</span>
            <select value={minRating} onChange={(event) => setMinRating(event.target.value)}>
              <option value="0">Any Overall</option>
              {overallOptions.map((rating) => <option key={rating} value={rating}>{rating}+ Overall</option>)}
            </select>
          </label>

          <label className="players-filter-control">
            <span>SORT BY</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          {clubs.length > 1 ? (
            <label className="players-filter-control">
              <span>CLUB</span>
              <select value={clubFilter} onChange={(event) => setClubFilter(event.target.value)}>
                {clubs.map((item) => <option key={item} value={item}>{item === "All" ? "All Clubs" : item}</option>)}
              </select>
            </label>
          ) : null}

          {leagues.length > 1 ? (
            <label className="players-filter-control">
              <span>LEAGUE</span>
              <select value={leagueFilter} onChange={(event) => setLeagueFilter(event.target.value)}>
                {leagues.map((item) => <option key={item} value={item}>{item === "All" ? "All Leagues" : item}</option>)}
              </select>
            </label>
          ) : null}

          {nations.length > 1 ? (
            <label className="players-filter-control">
              <span>NATION</span>
              <select value={nationFilter} onChange={(event) => setNationFilter(event.target.value)}>
                {nations.map((item) => <option key={item} value={item}>{item === "All" ? "All Nations" : item}</option>)}
              </select>
            </label>
          ) : null}

          {cardTypes.length > 1 ? (
            <label className="players-filter-control">
              <span>CARD TYPE</span>
              <select value={cardTypeFilter} onChange={(event) => setCardTypeFilter(event.target.value)}>
                {cardTypes.map((item) => <option key={item} value={item}>{item === "All" ? "All Card Types" : item}</option>)}
              </select>
            </label>
          ) : null}
        </div>

        <div className="players-filter-footer">
          <span>FILTERS UPDATE LIVE</span>
          <button type="button" className="players-done-button" onClick={() => setFiltersOpen(false)}>DONE</button>
        </div>
      </section>

      {filtersActive ? (
        <section className="players-active-filters" aria-label="Active filters">
          <span className="players-active-label">ACTIVE</span>
          {activeFilters.map((filter) => (
            <button type="button" className="players-filter-chip" key={filter.label} onClick={filter.clear}>
              {filter.label}<span aria-hidden="true">×</span>
            </button>
          ))}
          <button type="button" className="players-clear-all" onClick={onClear}>CLEAR ALL</button>
        </section>
      ) : null}

      <div className="players-results-bar" aria-live="polite">
        <div>
          <span className="players-results-count">{filtersActive ? `${players.length.toLocaleString()} PLAYERS FOUND` : `${totalPlayers.toLocaleString()} PLAYERS`}</span>
          <span className="players-results-detail">Showing {players.length.toLocaleString()} of {totalPlayers.toLocaleString()} players</span>
        </div>
        <span className="players-results-sort">{SORT_OPTIONS.find(([value]) => value === sortBy)?.[1] || "META Score ↓"}</span>
      </div>

      {players.length === 0 ? (
        <div className="empty-state players-empty-state">
          <div className="empty-symbol">×</div>
          <h3>NO PLAYERS FOUND</h3>
          <p>Try changing your search or filters.</p>
          <button type="button" className="reset-button" onClick={onClear}>RESET FILTERS</button>
        </div>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} onOpen={onOpen} onCompare={onCompare} />
          ))}
        </div>
      )}
    </main>
  );
}

export default PlayersPage;