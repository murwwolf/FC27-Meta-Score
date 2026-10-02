import { useMemo, useState } from "react";
import PlayerCard from "./PlayerCard";

const POSITION_ORDER = [
  "ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM",
  "LB", "LWB", "RB", "RWB", "CB", "GK",
];

const SORT_OPTIONS = [
  { key: "metaScore", label: "META Score", value: "meta-desc" },
  { key: "overall", label: "Overall", value: "ovr-desc" },
  { key: "pace", label: "PAC", value: "pac-desc" },
  { key: "shooting", label: "SHO", value: "sho-desc" },
  { key: "passing", label: "PAS", value: "pas-desc" },
  { key: "dribbling", label: "DRI", value: "dri-desc" },
  { key: "defending", label: "DEF", value: "def-desc" },
  { key: "physical", label: "PHY", value: "phy-desc" },
  { key: "name", label: "Name", value: "name-asc" },
];

const normalizeSearch = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const distinctNumbers = (players, field) => [...new Set(
  players
    .map((player) => Number(player[field]))
    .filter((value) => Number.isFinite(value))
)].sort((left, right) => left - right);

const dynamicOptions = (players, fields) => ["All", ...new Set(
  players.flatMap((player) => fields.map((field) => player[field])).filter(Boolean)
)].sort((left, right) => left === "All" ? -1 : right === "All" ? 1 : left.localeCompare(right));

function MetaFinderPage({ players, onOpen, onCompare }) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [minMeta, setMinMeta] = useState("All");
  const [maxMeta, setMaxMeta] = useState("All");
  const [tier, setTier] = useState("All");
  const [minOverall, setMinOverall] = useState("All");
  const [maxOverall, setMaxOverall] = useState("All");
  const [club, setClub] = useState("All");
  const [league, setLeague] = useState("All");
  const [nation, setNation] = useState("All");
  const [cardType, setCardType] = useState("All");
  const [sort, setSort] = useState("meta-desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const positionOptions = useMemo(() => {
    const existing = new Set(players.map((player) => String(player.position || "").trim().toUpperCase()).filter(Boolean));
    return [
      "All",
      ...POSITION_ORDER.filter((item) => existing.has(item)),
      ...[...existing].filter((item) => !POSITION_ORDER.includes(item)).sort(),
    ];
  }, [players]);
  const tiers = useMemo(() => [...new Set(players.map((player) => player.tier).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right)), [players]);
  const metaValues = useMemo(() => distinctNumbers(players, "metaScore"), [players]);
  const overallValues = useMemo(() => distinctNumbers(players, "overall"), [players]);
  const clubs = useMemo(() => dynamicOptions(players, ["club"]), [players]);
  const leagues = useMemo(() => dynamicOptions(players, ["league"]), [players]);
  const nations = useMemo(() => dynamicOptions(players, ["nation"]), [players]);
  const cardTypes = useMemo(() => dynamicOptions(players, ["cardType", "promoName"]), [players]);
  const sortOptions = useMemo(() => SORT_OPTIONS.filter(({ key }) => key === "name" ||
    players.some((player) => player[key] !== null && player[key] !== undefined &&
      player[key] !== "" && Number.isFinite(Number(player[key]))
    )
  ), [players]);

  const results = useMemo(() => {
    const query = normalizeSearch(search.trim());
    const matched = players.filter((player) => (
      (!query || normalizeSearch(player.name).includes(query)) &&
      (position === "All" || player.position === position) &&
      (minMeta === "All" || Number(player.metaScore) >= Number(minMeta)) &&
      (maxMeta === "All" || Number(player.metaScore) <= Number(maxMeta)) &&
      (tier === "All" || player.tier === tier) &&
      (minOverall === "All" || Number(player.overall) >= Number(minOverall)) &&
      (maxOverall === "All" || Number(player.overall) <= Number(maxOverall)) &&
      (club === "All" || player.club === club) &&
      (league === "All" || player.league === league) &&
      (nation === "All" || player.nation === nation) &&
      (cardType === "All" || player.cardType === cardType || player.promoName === cardType)
    ));
    const [sortKey, direction] = sort.split("-");
    const field = sortKey === "meta" ? "metaScore" : sortKey === "ovr" ? "overall" :
      ({ pac: "pace", sho: "shooting", pas: "passing", dri: "dribbling", def: "defending", phy: "physical" }[sortKey] || sortKey);
    const multiplier = direction === "asc" ? 1 : -1;
    return [...matched].sort((left, right) => {
      const primary = field === "name"
        ? String(left.name || "").localeCompare(String(right.name || "")) * multiplier
        : (Number(left[field] || 0) - Number(right[field] || 0)) * multiplier;
      if (primary !== 0) return primary;
      return Number(right.metaScore || 0) - Number(left.metaScore || 0) ||
        String(left.name || "").localeCompare(String(right.name || ""));
    });
  }, [players, search, position, minMeta, maxMeta, tier, minOverall, maxOverall, club, league, nation, cardType, sort]);

  const activeFilterCount = [
    search.trim() !== "", position !== "All", minMeta !== "All", maxMeta !== "All",
    tier !== "All", minOverall !== "All", maxOverall !== "All", club !== "All",
    league !== "All", nation !== "All", cardType !== "All",
  ].filter(Boolean).length;

  function resetFilters() {
    setSearch("");
    setPosition("All");
    setMinMeta("All");
    setMaxMeta("All");
    setTier("All");
    setMinOverall("All");
    setMaxOverall("All");
    setClub("All");
    setLeague("All");
    setNation("All");
    setCardType("All");
    setSort("meta-desc");
  }

  function renderNumberOptions(values, selected, setSelected, label, anyLabel) {
    return (
      <label className="finder-filter-control">
        <span>{label}</span>
        <select value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value="All">{anyLabel}</option>
          {values.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
    );
  }

  function renderOptions(options, selected, setSelected, label, allLabel) {
    return (
      <label className="finder-filter-control">
        <span>{label}</span>
        <select value={selected} onChange={(event) => setSelected(event.target.value)}>
          {options.map((option) => <option key={option} value={option}>{option === "All" ? allLabel : option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <main className={`meta-finder-page${filtersOpen ? " filters-expanded" : ""}`}>
      <header className="finder-header">
        <div className="hero-top">
          <div className="gold-line" />
          <div className="hero-label">FC27 PLAYER SCOUTING TOOL</div>
          <div className="gold-line" />
        </div>
        <div className="finder-heading">
          <div>
            <span className="section-label">SEARCH THE DATABASE</span>
            <h1>META <em>FINDER</em></h1>
            <p>Build a shortlist with the existing META ratings and player data.</p>
          </div>
          <div className="finder-database-count">
            <strong>{players.length}</strong>
            <span>PLAYERS</span>
          </div>
        </div>
        <label className="finder-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search player name..."
            aria-label="Search players by name"
          />
          {search ? <button type="button" aria-label="Clear player search" onClick={() => setSearch("")}>×</button> : null}
        </label>
      </header>

      <section className="finder-filter-panel" aria-label="META Finder filters">
        <div className="finder-filter-heading">
          <div>
            <span className="section-label">TUNE YOUR SEARCH</span>
            <h2>PLAYER FILTERS</h2>
          </div>
          <button
            type="button"
            className="finder-mobile-toggle"
            aria-expanded={filtersOpen}
            aria-controls="finder-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? "CLOSE FILTERS" : `FILTERS${activeFilterCount ? ` · ${activeFilterCount}` : ""}`}
          </button>
          <button type="button" className="finder-reset" onClick={resetFilters}>RESET FILTERS</button>
        </div>
        <div id="finder-filters" className={`finder-filter-grid${filtersOpen ? " is-open" : ""}`}>
          {renderOptions(positionOptions, position, setPosition, "POSITION", "All Positions")}
          {renderNumberOptions(metaValues, minMeta, setMinMeta, "MIN META", "Any META")}
          {renderNumberOptions(metaValues, maxMeta, setMaxMeta, "MAX META", "Any META")}
          {renderOptions(["All", ...tiers], tier, setTier, "TIER", "All Tiers")}
          {renderNumberOptions(overallValues, minOverall, setMinOverall, "MIN OVERALL", "Any Overall")}
          {renderNumberOptions(overallValues, maxOverall, setMaxOverall, "MAX OVERALL", "Any Overall")}
          {clubs.length > 1 ? renderOptions(clubs, club, setClub, "CLUB", "All Clubs") : null}
          {leagues.length > 1 ? renderOptions(leagues, league, setLeague, "LEAGUE", "All Leagues") : null}
          {nations.length > 1 ? renderOptions(nations, nation, setNation, "NATION", "All Nations") : null}
          {cardTypes.length > 1 ? renderOptions(cardTypes, cardType, setCardType, "CARD TYPE", "All Card Types") : null}
          <label className="finder-filter-control">
            <span>SORT BY</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="finder-filter-footer">
          <span>FILTERING USES EXISTING PLAYER DATA ONLY</span>
          <button type="button" className="finder-reset-mobile" onClick={resetFilters}>RESET ALL</button>
        </div>
      </section>

      <section className="finder-results" aria-live="polite" aria-labelledby="finder-results-title">
        <div className="finder-results-header">
          <div>
            <span className="section-label">YOUR SHORTLIST</span>
            <h2 id="finder-results-title">MATCHING PLAYERS <strong>{results.length}</strong></h2>
          </div>
          <span className="finder-sort-summary">SORTED BY {sortOptions.find((option) => option.value === sort)?.label.toUpperCase()}</span>
        </div>
        {results.length === 0 ? (
          <div className="finder-empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>No players match your current filters.</h3>
            <p>Adjust your search or reset filters to explore all {players.length} players.</p>
            <button type="button" onClick={resetFilters}>RESET FILTERS</button>
          </div>
        ) : (
          <div className="finder-player-grid">
            {results.map((player, index) => (
              <div className="finder-result-card" key={player.id} style={{ "--finder-order": Math.min(index, 12) }}>
                <PlayerCard player={player} onOpen={onOpen} onCompare={onCompare} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MetaFinderPage;
