import PlayerCard from "./PlayerCard";
import { useMemo, useState } from "react";

const POSITION_ORDER = [
  "ST",
  "CF",
  "LW",
  "RW",
  "LM",
  "RM",
  "CAM",
  "CM",
  "CDM",
  "LB",
  "LWB",
  "RB",
  "RWB",
  "CB",
  "GK",
];

const SORT_OPTIONS = [
  { value: "metaScore", label: "META Score" },
  { value: "overall", label: "Overall" },
  { value: "pace", label: "PAC" },
  { value: "shooting", label: "SHO" },
  { value: "passing", label: "PAS" },
  { value: "dribbling", label: "DRI" },
  { value: "defending", label: "DEF" },
  { value: "physical", label: "PHY" },
  { value: "name", label: "Name" },
];

const displayValue = (value, fallback = "Not listed") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};

function RankingsPage({ players, onOpen, onCompare }) {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedSort, setSelectedSort] = useState("metaScore");
  const [search, setSearch] = useState("");
  const [minOverall, setMinOverall] = useState("All");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [clubFilter, setClubFilter] = useState("All");
  const [nationFilter, setNationFilter] = useState("All");
  const [cardTypeFilter, setCardTypeFilter] = useState("All");

  const positionOptions = useMemo(() => {
    const existingPositions = new Set(
      players
        .map((player) => String(player.position || "").trim().toUpperCase())
        .filter(Boolean)
    );

    return ["All", ...POSITION_ORDER.filter((position) => existingPositions.has(position))];
  }, [players]);

  const leagueOptions = useMemo(
    () => ["All", ...new Set(players.map((player) => player.league).filter(Boolean))].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    }),
    [players]
  );

  const clubOptions = useMemo(
    () => ["All", ...new Set(players.map((player) => player.club).filter(Boolean))].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    }),
    [players]
  );

  const nationOptions = useMemo(
    () => ["All", ...new Set(players.map((player) => player.nation).filter(Boolean))].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    }),
    [players]
  );

  const cardTypeOptions = useMemo(
    () => ["All", ...new Set(players.map((player) => player.cardType || player.promoName || "Base"))].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    }),
    [players]
  );

  const rankedPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = players.filter((player) => {
      const position = String(player.position || "").toUpperCase();
      const cardType = player.cardType || player.promoName || "Base";
      const matchesQuery =
        !query ||
        [player.name, player.club, player.nation, position, player.league]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return (
        matchesQuery &&
        (selectedPosition === "All" || position === selectedPosition) &&
        (selectedTier === "All" || player.tier === selectedTier) &&
        (minOverall === "All" || Number(player.overall) >= Number(minOverall)) &&
        (leagueFilter === "All" || player.league === leagueFilter) &&
        (clubFilter === "All" || player.club === clubFilter) &&
        (nationFilter === "All" || player.nation === nationFilter) &&
        (cardTypeFilter === "All" || cardType === cardTypeFilter)
      );
    });

    return [...filtered].sort((left, right) => {
      const sortKey = selectedSort;
      let result = 0;

      if (sortKey === "name") {
        result = String(left.name || "").localeCompare(String(right.name || ""));
      } else if (sortKey === "metaScore") {
        result = Number(right.metaScore || 0) - Number(left.metaScore || 0);
      } else {
        result = Number(right[sortKey] || 0) - Number(left[sortKey] || 0);
      }

      if (result === 0) {
        const metaDiff = Number(right.metaScore || 0) - Number(left.metaScore || 0);
        if (metaDiff !== 0) {
          return metaDiff;
        }

        const overallDiff = Number(right.overall || 0) - Number(left.overall || 0);
        if (overallDiff !== 0) {
          return overallDiff;
        }

        return String(left.name || "").localeCompare(String(right.name || ""));
      }

      return result;
    });
  }, [players, search, selectedPosition, selectedTier, selectedSort, minOverall, leagueFilter, clubFilter, nationFilter, cardTypeFilter]);

  const featuredPlayers = rankedPlayers.slice(0, 10);

  const resetFilters = () => {
    setSearch("");
    setSelectedPosition("All");
    setSelectedTier("All");
    setSelectedSort("metaScore");
    setMinOverall("All");
    setLeagueFilter("All");
    setClubFilter("All");
    setNationFilter("All");
    setCardTypeFilter("All");
  };

  return (
    <main className="rankings-page players-section">
      <div className="hero-top">
        <div className="gold-line" />
        <div className="hero-label">FC27 META RANKINGS</div>
        <div className="gold-line" />
      </div>

      <div className="section-header rankings-header">
        <div>
          <div className="section-label">TOP META PLAYERS</div>
          <h2>FC27 META LEADERBOARD</h2>
        </div>

        <div className="database-counter">
          <span className="counter-number">{players.length}</span>
          <span className="counter-text">PLAYERS</span>
        </div>
      </div>

      <p className="rankings-subtitle">Discover the highest-rated META players in FC27 Ultimate Team.</p>

      <div className="filters rankings-filters">
        <div className="filter-box search-box rankings-search-box">
          <label className="sr-only" htmlFor="rankings-search">Search players</label>
          <input
            id="rankings-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search players..."
            aria-label="Search players"
          />
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-tier">Tier</label>
          <select id="rankings-tier" value={selectedTier} onChange={(event) => setSelectedTier(event.target.value)} aria-label="Tier filter">
            <option value="All">All Tiers</option>
            <option value="S">S Tier</option>
            <option value="A">A Tier</option>
            <option value="B">B Tier</option>
            <option value="C">C Tier</option>
            <option value="D">D Tier</option>
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-min-overall">Minimum overall</label>
          <select id="rankings-min-overall" value={minOverall} onChange={(event) => setMinOverall(event.target.value)} aria-label="Minimum overall">
            <option value="All">Any Overall</option>
            {[90, 85, 80, 75, 70].map((rating) => (
              <option key={rating} value={rating}>{rating}+ Overall</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-sort">Sort by</label>
          <select id="rankings-sort" value={selectedSort} onChange={(event) => setSelectedSort(event.target.value)} aria-label="Sort players">
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-league">League</label>
          <select id="rankings-league" value={leagueFilter} onChange={(event) => setLeagueFilter(event.target.value)} aria-label="League filter">
            {leagueOptions.map((league) => (
              <option key={league} value={league}>{league === "All" ? "All Leagues" : league}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-club">Club</label>
          <select id="rankings-club" value={clubFilter} onChange={(event) => setClubFilter(event.target.value)} aria-label="Club filter">
            {clubOptions.map((club) => (
              <option key={club} value={club}>{club === "All" ? "All Clubs" : club}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-nation">Nation</label>
          <select id="rankings-nation" value={nationFilter} onChange={(event) => setNationFilter(event.target.value)} aria-label="Nation filter">
            {nationOptions.map((nation) => (
              <option key={nation} value={nation}>{nation === "All" ? "All Nations" : nation}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label className="sr-only" htmlFor="rankings-card-type">Card type</label>
          <select id="rankings-card-type" value={cardTypeFilter} onChange={(event) => setCardTypeFilter(event.target.value)} aria-label="Card type filter">
            {cardTypeOptions.map((cardType) => (
              <option key={cardType} value={cardType}>{cardType === "All" ? "All Card Types" : cardType}</option>
            ))}
          </select>
        </div>

        <button type="button" className="clear-button rankings-reset" onClick={resetFilters}>RESET FILTERS</button>
      </div>

      <div className="ranking-tabs rankings-position-tabs" role="tablist" aria-label="Position filters">
        {positionOptions.map((position) => (
          <button
            key={position}
            type="button"
            role="tab"
            aria-selected={selectedPosition === position}
            className={selectedPosition === position ? "active" : ""}
            onClick={() => setSelectedPosition(position)}
          >
            {position === "All" ? "ALL" : position}
          </button>
        ))}
      </div>

      {featuredPlayers.length === 0 ? (
        <div className="empty-state">
          <h3>No players found.</h3>
          <p>Try changing your filters or search.</p>
        </div>
      ) : (
        <section className="featured-rankings">
          <div className="top-rankings-grid">
            {featuredPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                onOpen={onOpen}
                onCompare={onCompare}
                rank={index + 1}
                compact
              />
            ))}
          </div>
        </section>
      )}

      <section className="ranking-list-panel">
        <div className="section-header ranking-list-header">
          <div>
            <div className="section-label">RANKING LIST</div>
            <h2>FULL META TABLE</h2>
          </div>
        </div>

        {rankedPlayers.length === 0 ? (
          <div className="empty-state rankings-empty-state">
            <h3>No players found.</h3>
            <p>Try changing your filters or search.</p>
          </div>
        ) : (
          <div className="ranking-table" role="table" aria-label="FC27 rankings table">
            <div className="ranking-table-header" role="rowgroup">
              <div className="ranking-row ranking-header" role="row">
                <span role="columnheader">RANK</span>
                <span role="columnheader">PLAYER</span>
                <span role="columnheader">POS</span>
                <span role="columnheader">OVR</span>
                <span role="columnheader">META</span>
                <span role="columnheader">PAC</span>
                <span role="columnheader">SHO</span>
                <span role="columnheader">PAS</span>
                <span role="columnheader">DRI</span>
                <span role="columnheader">DEF</span>
                <span role="columnheader">PHY</span>
                <span role="columnheader">CLUB</span>
              </div>
            </div>

            <div className="ranking-table-body" role="rowgroup">
              {rankedPlayers.map((player, index) => (
                <button
                  key={player.id}
                  type="button"
                  className="ranking-row ranking-table-row"
                  onClick={() => onOpen(player)}
                  aria-label={`Open ${player.name} player details`}
                >
                  <span className="rank-value">#{index + 1}</span>
                  <span className="player-value">
                    <span className="player-avatar" aria-hidden="true">
                      {player.image ? (
                        <img src={player.image} alt="" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.classList.add("fallback"); }} />
                      ) : null}
                    </span>
                    <span className="player-text">
                      <strong>{displayValue(player.name)}</strong>
                      <small>{displayValue(player.position)} • {displayValue(player.nation)}</small>
                    </span>
                  </span>
                  <span className="stat-value">{displayValue(player.position)}</span>
                  <span className="stat-value">{displayValue(player.overall)}</span>
                  <span className="meta-value">{displayValue(player.metaScore)}</span>
                  <span className="stat-value">{displayValue(player.pace)}</span>
                  <span className="stat-value">{displayValue(player.shooting)}</span>
                  <span className="stat-value">{displayValue(player.passing)}</span>
                  <span className="stat-value">{displayValue(player.dribbling)}</span>
                  <span className="stat-value">{displayValue(player.defending)}</span>
                  <span className="stat-value">{displayValue(player.physical)}</span>
                  <span className="club-value">{displayValue(player.club)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default RankingsPage;
