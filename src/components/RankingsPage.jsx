import { useMemo, useState } from "react";
import PlayerCard from "./PlayerCard";

const POSITION_ORDER = [
  "ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM",
  "LB", "LWB", "RB", "RWB", "CB", "GK",
];

const POSITION_GROUPS = [
  { label: "ATTACK", positions: ["ST", "CF", "LW", "RW", "LM", "RM"] },
  { label: "MIDFIELD", positions: ["CAM", "CM", "CDM"] },
  { label: "DEFENCE", positions: ["LB", "LWB", "RB", "RWB", "CB"] },
  { label: "GOALKEEPERS", positions: ["GK"] },
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

const TIER_ORDER = ["S", "A", "B", "C", "D"];
const normalizeSearch = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

function RankingsPage({ players, onOpen }) {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedSort, setSelectedSort] = useState("metaScore");
  const [search, setSearch] = useState("");

  const positionOptions = useMemo(() => {
    const existingPositions = new Set(
      players
        .map((player) => String(player.position || "").trim().toUpperCase())
        .filter(Boolean)
    );
    const ordered = POSITION_ORDER.filter((position) => existingPositions.has(position));
    const additional = [...existingPositions].filter((position) => !POSITION_ORDER.includes(position)).sort();
    return ["All", ...ordered, ...additional];
  }, [players]);

  const groupOptions = useMemo(() => {
    const existingPositions = new Set(positionOptions.slice(1));
    return POSITION_GROUPS.filter((group) => group.positions.some((position) => existingPositions.has(position)));
  }, [positionOptions]);

  const tierOptions = useMemo(() => {
    const existingTiers = new Set(players.map((player) => player.tier).filter(Boolean));
    return [
      ...TIER_ORDER.filter((tier) => existingTiers.has(tier)),
      ...[...existingTiers].filter((tier) => !TIER_ORDER.includes(tier)).sort(),
    ];
  }, [players]);

  const sortOptions = useMemo(() => SORT_OPTIONS.filter(({ value }) => (
    value === "name" ||
    players.some((player) => player[value] !== null && player[value] !== undefined &&
      player[value] !== "" && Number.isFinite(Number(player[value])))
  )), [players]);

  const rankedPlayers = useMemo(() => {
    const query = normalizeSearch(search.trim());
    const filtered = players.filter((player) => {
      const position = String(player.position || "").trim().toUpperCase();
      const matchesGroup = selectedGroup === "All" ||
        POSITION_GROUPS.find((group) => group.label === selectedGroup)?.positions.includes(position);

      return (
        (!query || normalizeSearch(player.name).includes(query)) &&
        (selectedPosition === "All" || position === selectedPosition) &&
        matchesGroup &&
        (selectedTier === "All" || player.tier === selectedTier)
      );
    });

    return [...filtered].sort((left, right) => {
      const result = selectedSort === "name"
        ? String(left.name || "").localeCompare(String(right.name || ""))
        : (Number(right[selectedSort] || 0) - Number(left[selectedSort] || 0));
      if (result !== 0) return result;

      const metaDiff = Number(right.metaScore || 0) - Number(left.metaScore || 0);
      if (metaDiff !== 0) return metaDiff;
      const overallDiff = Number(right.overall || 0) - Number(left.overall || 0);
      return overallDiff || String(left.name || "").localeCompare(String(right.name || ""));
    });
  }, [players, search, selectedPosition, selectedGroup, selectedTier, selectedSort]);

  const podiumPlayers = rankedPlayers.slice(0, 3);
  const topTenPlayers = rankedPlayers.slice(0, 10);
  const remainingPlayers = rankedPlayers.slice(10);

  function resetFilters() {
    setSearch("");
    setSelectedPosition("All");
    setSelectedGroup("All");
    setSelectedTier("All");
    setSelectedSort("metaScore");
  }

  function renderRow(player, index) {
    return (
      <button
        key={player.id}
        type="button"
        className="leaderboard-row"
        onClick={() => onOpen(player)}
        aria-label={`Open ${player.name} player details`}
      >
        <span className="leaderboard-rank">#{index + 1}</span>
        <span className="leaderboard-player">
          <span className="leaderboard-avatar" aria-hidden="true">
            {player.image ? (
              <img
                src={player.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.parentElement.classList.add("fallback");
                }}
              />
            ) : null}
            <span>{String(player.name || "?").charAt(0)}</span>
          </span>
          <span className="leaderboard-player-name">{player.name}</span>
        </span>
        <span className="leaderboard-position" data-label="POS">{player.position}</span>
        <span className="leaderboard-overall" data-label="OVR">{player.overall}</span>
        <span className="leaderboard-meta" data-label="META">{player.metaScore}</span>
        <span className={`leaderboard-tier tier-${String(player.tier || "").toLowerCase()}`} data-label="TIER">{player.tier} TIER</span>
        <span className="leaderboard-stat">{player.pace}</span>
        <span className="leaderboard-stat">{player.shooting}</span>
        <span className="leaderboard-stat">{player.passing}</span>
        <span className="leaderboard-stat">{player.dribbling}</span>
        <span className="leaderboard-stat">{player.defending}</span>
        <span className="leaderboard-stat">{player.physical}</span>
      </button>
    );
  }

  return (
    <main className="rankings-page players-section">
      <div className="hero-top">
        <div className="gold-line" />
        <div className="hero-label">FC27 META RANKINGS</div>
        <div className="gold-line" />
      </div>

      <div className="section-header rankings-header">
        <div>
          <div className="section-label">THE META LEADERBOARD</div>
          <h2>RANKED BY PERFORMANCE</h2>
        </div>
        <div className="database-counter">
          <span className="counter-number">{players.length}</span>
          <span className="counter-text">PLAYERS</span>
        </div>
      </div>
      <p className="rankings-subtitle">Explore every player, ranked by the existing FC27 META Score.</p>

      <section className="rankings-controls" aria-label="Ranking filters">
        <div className="rankings-filter-grid">
          <label className="rankings-search">
            <span className="sr-only">Search player names</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search player name..."
              aria-label="Search player names"
            />
          </label>
          <label className="rankings-select">
            <span>POSITION</span>
            <select
              value={selectedPosition}
              onChange={(event) => {
                setSelectedGroup("All");
                setSelectedPosition(event.target.value);
              }}
              aria-label="Filter by position"
            >
              {positionOptions.map((position) => (
                <option key={position} value={position}>{position === "All" ? "All positions" : position}</option>
              ))}
            </select>
          </label>
          <label className="rankings-select">
            <span>META TIER</span>
            <select value={selectedTier} onChange={(event) => setSelectedTier(event.target.value)} aria-label="Filter by META tier">
              <option value="All">All tiers</option>
              {tierOptions.map((tier) => <option key={tier} value={tier}>{tier} Tier</option>)}
            </select>
          </label>
          <label className="rankings-select">
            <span>SORT BY</span>
            <select value={selectedSort} onChange={(event) => setSelectedSort(event.target.value)} aria-label="Sort rankings">
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="rankings-category-tabs" role="tablist" aria-label="Player category">
          <button
            type="button"
            role="tab"
            aria-selected={selectedGroup === "All"}
            className={selectedGroup === "All" ? "active" : ""}
            onClick={() => {
              setSelectedGroup("All");
              setSelectedPosition("All");
            }}
          >
            OVERALL
          </button>
          {groupOptions.map((group) => (
            <button
              key={group.label}
              type="button"
              role="tab"
              aria-selected={selectedGroup === group.label}
              className={selectedGroup === group.label ? "active" : ""}
              onClick={() => {
                setSelectedGroup(group.label);
                setSelectedPosition("All");
              }}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="rankings-position-chips" role="group" aria-label="Quick position filter">
          <span>POSITION</span>
          {positionOptions.map((position) => (
            <button
              key={position}
              type="button"
              aria-pressed={selectedPosition === position}
              className={selectedPosition === position ? "active" : ""}
              onClick={() => {
                setSelectedGroup("All");
                setSelectedPosition(position);
              }}
            >
              {position === "All" ? "ALL" : position}
            </button>
          ))}
        </div>
      </section>

      {rankedPlayers.length === 0 ? (
        <section className="rankings-empty-state">
          <span aria-hidden="true">✦</span>
          <h3>No players match your filters.</h3>
          <p>Try another position, tier, or player name.</p>
          <button type="button" onClick={resetFilters}>RESET FILTERS</button>
        </section>
      ) : (
        <>
          <section className="ranking-podium-section" aria-labelledby="rankings-podium-title">
            <div className="ranking-section-heading">
              <div><span className="section-label">THE ELITE THREE</span><h2 id="rankings-podium-title">META PODIUM</h2></div>
              <span>{rankedPlayers.length} PLAYERS RANKED</span>
            </div>
            <div className="ranking-podium-grid">
              {podiumPlayers.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onOpen={onOpen}
                  rank={index + 1}
                  compact
                  showCompareButton={false}
                />
              ))}
            </div>
          </section>

          <section className="ranking-list-panel" aria-labelledby="rankings-top-ten-title">
            <div className="ranking-section-heading">
              <div><span className="section-label">THE CONTENDERS</span><h2 id="rankings-top-ten-title">TOP 10 PLAYERS</h2></div>
              <span>BASED ON {sortOptions.find((option) => option.value === selectedSort)?.label.toUpperCase()}</span>
            </div>
            <div className="leaderboard-table">
              <div className="leaderboard-head" aria-hidden="true">
                <span>RANK</span><span>PLAYER</span><span>POS</span><span>OVR</span><span>META</span><span>TIER</span>
                <span>PAC</span><span>SHO</span><span>PAS</span><span>DRI</span><span>DEF</span><span>PHY</span>
              </div>
              <div className="leaderboard-body">
                {topTenPlayers.map((player, index) => renderRow(player, index))}
              </div>
            </div>
          </section>

          {remainingPlayers.length > 0 && (
            <section className="ranking-list-panel ranking-full-list" aria-labelledby="rankings-full-title">
              <div className="ranking-section-heading">
                <div><span className="section-label">THE COMPLETE FIELD</span><h2 id="rankings-full-title">FULL META LEADERBOARD</h2></div>
                <span>RANKS 11–{rankedPlayers.length}</span>
              </div>
              <div className="leaderboard-table">
                <div className="leaderboard-head" aria-hidden="true">
                  <span>RANK</span><span>PLAYER</span><span>POS</span><span>OVR</span><span>META</span><span>TIER</span>
                  <span>PAC</span><span>SHO</span><span>PAS</span><span>DRI</span><span>DEF</span><span>PHY</span>
                </div>
                <div className="leaderboard-body">
                  {remainingPlayers.map((player, index) => renderRow(player, index + 10))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default RankingsPage;
