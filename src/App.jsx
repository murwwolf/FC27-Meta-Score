import { useMemo, useState } from "react";
import players from "./lib/playerData";
import { calculateMetaScore, getTier } from "./lib/metaScore";

function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [tier, setTier] = useState("All");
  const [minRating, setMinRating] = useState("All");

  // League / Club / Nation filters
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [clubFilter, setClubFilter] = useState("All");
  const [nationFilter, setNationFilter] = useState("All");

  const [sortBy, setSortBy] = useState("meta-desc");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [comparePlayers, setComparePlayers] = useState([]);

  const scoredPlayers = useMemo(() => {
    return players.map((player) => {
      const metaScore = calculateMetaScore(player);

      return {
        ...player,
        metaScore,
        tier: getTier(metaScore),
      };
    });
  }, []);

  const filteredPlayers = useMemo(() => {
    let result = [...scoredPlayers];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((player) =>
        [
          player.name,
          player.club,
          player.nation,
          player.position,
          player.league,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    if (position !== "All") {
      result = result.filter(
        (player) => player.position === position
      );
    }

    if (tier !== "All") {
      result = result.filter(
        (player) => player.tier === tier
      );
    }

    if (minRating !== "All") {
      result = result.filter(
        (player) => player.overall >= Number(minRating)
      );
    }

    if (leagueFilter !== "All") {
      result = result.filter(
        (player) => player.league === leagueFilter
      );
    }

    if (clubFilter !== "All") {
      result = result.filter(
        (player) => player.club === clubFilter
      );
    }

    if (nationFilter !== "All") {
      result = result.filter(
        (player) => player.nation === nationFilter
      );
    }

    result.sort((a, b) => {
  switch (sortBy) {
    case "meta-desc":
      return b.metaScore - a.metaScore;

    case "meta-asc":
      return a.metaScore - b.metaScore;

    case "ovr-desc":
      return b.overall - a.overall;

    case "ovr-asc":
      return a.overall - b.overall;

    case "name-asc":
      return a.name.localeCompare(b.name);

    case "name-desc":
      return b.name.localeCompare(a.name);

    case "pace-desc":
      return b.pace - a.pace;

    case "shooting-desc":
      return b.shooting - a.shooting;

    case "passing-desc":
      return b.passing - a.passing;

    case "dribbling-desc":
      return b.dribbling - a.dribbling;

    case "defending-desc":
      return b.defending - a.defending;

    case "physical-desc":
      return b.physical - a.physical;

    default:
      return b.metaScore - a.metaScore;
  }
});

    return result;
  }, [
    scoredPlayers,
    search,
    position,
    tier,
    minRating,
    sortBy,
    leagueFilter,
    clubFilter,
    nationFilter,
  ]);

  const positions = [
    "All",
    ...new Set(
      scoredPlayers
        .map((player) => player.position)
        .filter(Boolean)
    ),
  ];

  const leagues = [
    "All",
    ...new Set(
      scoredPlayers
        .map((player) => player.league)
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  const clubs = [
    "All",
    ...new Set(
      scoredPlayers
        .map((player) => player.club)
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  const nations = [
    "All",
    ...new Set(
      scoredPlayers
        .map((player) => player.nation)
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  function openPlayer(player) {
    setSelectedPlayer(player);
    setPage("player");
  }

  function goHome() {
    setPage("home");
    setSelectedPlayer(null);
  }

  function clearFilters() {
    setSearch("");
    setPosition("All");
    setTier("All");
    setMinRating("All");
    setSortBy("meta-desc");

    setLeagueFilter("All");
    setClubFilter("All");
    setNationFilter("All");
  }
function addToCompare(player) {
    setComparePlayers((current) => {
      if (current.some((item) => item?.id === player.id)) {
        return current;
      }

      if (current.length >= 2) {
        return [current[1], player];
      }

      return [...current, player];
    });

    setPage("compare");
    setSelectedPlayer(null);
  }

  function selectComparePlayer(index, player) {
    setComparePlayers((current) => {
      const next = [...current];

      while (next.length < 2) {
        next.push(null);
      }

      next[index] = player;

      return next;
    });
  }

  function removeComparePlayer(index) {
    setComparePlayers((current) => {
      const next = [...current];

      next[index] = null;

      return next;
    });
  }

  function swapComparePlayers() {
    setComparePlayers((current) => {
      const first = current[0] || null;
      const second = current[1] || null;

      return [second, first];
    });
  }

  const navItems = [
    ["home", "HOME"],
    ["players", "PLAYERS"],
    ["rankings", "RANKINGS"],
    ["compare", "COMPARE"],
  ];

  return (
    <div className="app">
      <div className="background-grid" />

      <div className="red-glow red-glow-one" />
      <div className="red-glow red-glow-two" />

      <nav className="navbar">
        <button
          className="brand"
          onClick={goHome}
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
              className={page === value ? "active" : ""}
              onClick={() => {
                setPage(value);
                setSelectedPlayer(null);
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

      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-top">
              <div className="gold-line" />

              <div className="hero-label">
                FC27 ULTIMATE TEAM
              </div>

              <div className="gold-line" />
            </div>

            <h1>
              How <span>META</span> Is Your
              <br />
              FC27 Player?
            </h1>

            <p className="hero-subtitle">
              Search real FC27 players and discover their META
              score.
            </p>

            <div className="filters">
              <div className="filter-box search-box">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search for an FC27 player..."
                />
              </div>
            </div>
          </section>

          <section className="players-section">
            <div className="section-header">
              <div>
                <div className="section-label">
                  PLAYER DATABASE
                </div>

                <h2>FC27 META PLAYERS</h2>
              </div>

              <div className="database-counter">
                <span className="counter-number">
                  {filteredPlayers.length}
                </span>

                <span className="counter-text">
                  PLAYERS
                </span>
              </div>

              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                CLEAR FILTERS
              </button>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-symbol">×</div>

                <h3>No players found</h3>

                <p>
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  className="reset-button"
                  onClick={clearFilters}
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="players-grid">
                {filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onOpen={openPlayer}
                    onCompare={addToCompare}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {page === "players" && (
        <PlayersPage
          players={filteredPlayers}
          search={search}
          setSearch={setSearch}
          position={position}
          setPosition={setPosition}
          tier={tier}
          setTier={setTier}
          leagueFilter={leagueFilter}
          setLeagueFilter={setLeagueFilter}
          clubFilter={clubFilter}
          setClubFilter={setClubFilter}
          nationFilter={nationFilter}
          setNationFilter={setNationFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          positions={positions}
          leagues={leagues}
          clubs={clubs}
          nations={nations}
          onOpen={openPlayer}
          onCompare={addToCompare}
          onClear={clearFilters}
        />
      )}

      {page === "rankings" && (
        <RankingsPage
          players={scoredPlayers}
          onOpen={openPlayer}
          onCompare={addToCompare}
        />
      )}

      {page === "compare" && (
        <ComparePage
          players={comparePlayers}
          allPlayers={scoredPlayers}
          onSelect={selectComparePlayer}
          onRemove={removeComparePlayer}
          onSwap={swapComparePlayers}
          onOpen={openPlayer}
        />
      )}

      {page === "player" && selectedPlayer && (
        <PlayerDetails
          player={selectedPlayer}
          onBack={goHome}
          onCompare={addToCompare}
        />
      )}

      <footer>
        <div className="footer-brand">
          <span className="brand-fc">FC27</span>{" "}
          <span className="brand-meta">META SCORE</span>
        </div>

        <span>REAL PLAYER DATA • FC27</span>
      </footer>
    </div>
  );
}

/* =========================
   PLAYER CARD
========================= */

function PlayerCard({
  player,
  onOpen,
  onCompare,
}) {
  const isGK = player.position === "GK";

  return (
    <article
      className="player-card"
      onClick={() => onOpen(player)}
    >
      <div className="card-top">
        <div className="rating">
          <span>OVR</span>
          <strong>{player.overall}</strong>
        </div>

        <div className="player-name">
          {player.name}
        </div>

        <div className="position-badge">
          {player.position}
        </div>
      </div>

      <div className="player-image-area">
        <div className="image-glow" />

        {player.image ? (
          <img
            className="player-image"
            src={player.image}
            alt={player.name}
          />
        ) : (
          <div className="image-placeholder">
            {player.name.charAt(0)}
          </div>
        )}

        <div className="meta-score">
          <span>META</span>
          <strong>{player.metaScore}</strong>
          <small>{player.tier} TIER</small>
        </div>
      </div>

      <div className="player-info">
        <div className="player-full-name">
          {player.name}
        </div>

        <div className="player-location">
          <span>{player.nation}</span>
          <span className="dot">•</span>
          <span>{player.league}</span>
        </div>

        <div className="club">
          {player.club}
        </div>

        <div className="stats-title">
          BASE ATTRIBUTES
        </div>

        <div className="stats-grid">
          {isGK ? (
            <>
              <Stat label="DIV" value={player.pace} />
              <Stat label="HAN" value={player.shooting} />
              <Stat label="KICK" value={player.passing} />
              <Stat label="REF" value={player.dribbling} />
              <Stat label="SPD" value={player.defending} />
              <Stat label="POS" value={player.physical} />
            </>
          ) : (
            <>
              <Stat label="PAC" value={player.pace} />
              <Stat label="SHO" value={player.shooting} />
              <Stat label="PAS" value={player.passing} />
              <Stat label="DRI" value={player.dribbling} />
              <Stat label="DEF" value={player.defending} />
              <Stat label="PHY" value={player.physical} />
            </>
          )}
        </div>

        <button
          type="button"
          className="reset-button"
          onClick={(event) => {
            event.stopPropagation();
            onCompare(player);
          }}
        >
          COMPARE
        </button>
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================
   PLAYERS PAGE
========================= */

function PlayersPage({
  players,
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
  const hasSearched = search.trim().length > 0;

  return (
    <main className="players-section">
      <div className="hero-top">
        <div className="gold-line" />

        <div className="hero-label">
          PLAYER DATABASE
        </div>

        <div className="gold-line" />
      </div>

      <div className="section-header">
        <div>
          <div className="section-label">
            FC27 DATABASE
          </div>

          <h2>ALL PLAYERS</h2>
        </div>

        <div className="database-counter">
          <span className="counter-number">
            {hasSearched ? players.length : "—"}
          </span>

          <span className="counter-text">
            {hasSearched ? "PLAYERS" : "SEARCH"}
          </span>
        </div>

        <button
          type="button"
          className="clear-button"
          onClick={onClear}
        >
          CLEAR FILTERS
        </button>
      </div>

      <div className="filters">
        <div className="filter-box search-box">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search players..."
          />
        </div>

        <div className="filter-box">
          <select
            value={position}
            onChange={(event) =>
              setPosition(event.target.value)
            }
          >
            {positions.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Positions"
                  : item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={tier}
            onChange={(event) =>
              setTier(event.target.value)
            }
          >
            <option value="All">All Tiers</option>
            <option value="S">S Tier</option>
            <option value="A">A Tier</option>
            <option value="B">B Tier</option>
            <option value="C">C Tier</option>
            <option value="D">D Tier</option>
          </select>
        </div>

        <div className="filter-box">
          <select
            value={leagueFilter}
            onChange={(event) =>
              setLeagueFilter(event.target.value)
            }
          >
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league === "All"
                  ? "All Leagues"
                  : league}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={clubFilter}
            onChange={(event) =>
              setClubFilter(event.target.value)
            }
          >
            {clubs.map((club) => (
              <option key={club} value={club}>
                {club === "All"
                  ? "All Clubs"
                  : club}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={nationFilter}
            onChange={(event) =>
              setNationFilter(event.target.value)
            }
          >
            {nations.map((nation) => (
              <option key={nation} value={nation}>
                {nation === "All"
                  ? "All Nations"
                  : nation}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="meta-desc">
              META Rating — High to Low
            </option>

            <option value="meta-asc">
              META Rating — Low to High
            </option>

            <option value="ovr-desc">
              OVR — High to Low
            </option>

            <option value="ovr-asc">
              OVR — Low to High
            </option>

            <option value="name-asc">
              Name — A to Z
            </option>

            <option value="name-desc">
              Name — Z to A
            </option>

            <option value="pace-desc">
              Pace — High to Low
            </option>

            <option value="shooting-desc">
              Shooting — High to Low
            </option>

            <option value="passing-desc">
              Passing — High to Low
            </option>

            <option value="dribbling-desc">
              Dribbling — High to Low
            </option>

            <option value="defending-desc">
              Defending — High to Low
            </option>

            <option value="physical-desc">
              Physical — High to Low
            </option>
          </select>
        </div>
      </div>

      {!hasSearched ? (
        <div className="empty-state">
          <div className="empty-symbol">⌕</div>

          <h3>Search the FC27 database</h3>

          <p>
            Search for a player to view their FC27 META
            card and detailed stats.
          </p>
        </div>
      ) : players.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">×</div>

          <h3>No players found</h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            type="button"
            className="reset-button"
            onClick={onClear}
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onOpen={onOpen}
              onCompare={onCompare}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/* =========================
   RANKINGS
========================= */

function RankingsPage({
  players,
  onOpen,
  onCompare,
}) {
  const rankedPlayers = [...players].sort(
    (a, b) => b.metaScore - a.metaScore
  );

  return (
    <main className="players-section">
      <div className="hero-top">
        <div className="gold-line" />

        <div className="hero-label">
          META RANKINGS
        </div>

        <div className="gold-line" />
      </div>

      <div className="section-header">
        <div>
          <div className="section-label">
            TOP FC27 PLAYERS
          </div>

          <h2>META RANKINGS</h2>
        </div>

        <div className="database-counter">
          <span className="counter-number">
            {rankedPlayers.length}
          </span>

          <span className="counter-text">
            PLAYERS
          </span>
        </div>
      </div>

      <div className="players-grid">
        {rankedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onOpen={onOpen}
            onCompare={onCompare}
          />
        ))}
      </div>
    </main>
  );
}

/* =========================
   COMPARE PAGE
========================= */

function ComparePage({
  players,
  allPlayers,
  onSelect,
  onRemove,
  onSwap,
  onOpen,
}) {
  const first = players[0] || null;
  const second = players[1] || null;

  return (
    <main className="players-section">
      <div className="hero-top">
        <div className="gold-line" />

        <div className="hero-label">
          PLAYER COMPARISON
        </div>

        <div className="gold-line" />
      </div>

      <div className="section-header">
        <div>
          <div className="section-label">
            FC27
          </div>

          <h2>COMPARE PLAYERS</h2>
        </div>

        {first && second && (
          <button
            type="button"
            className="clear-button"
            onClick={onSwap}
          >
            ↔ SWAP
          </button>
        )}
      </div>

      <div className="compare-select-area">
        <CompareSelector
          label="PLAYER 1"
          value={first?.id || ""}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(0, player)}
          onRemove={() => onRemove(0)}
        />

        <div className="compare-vs-small">
          VS
        </div>

        <CompareSelector
          label="PLAYER 2"
          value={second?.id || ""}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(1, player)}
          onRemove={() => onRemove(1)}
        />
      </div>

      {!first || !second ? (
        <div className="empty-state">
          <div className="empty-symbol">
            VS
          </div>

          <h3>Select two players</h3>

          <p>
            Choose two FC27 players above to unlock
            the full comparison.
          </p>
        </div>
      ) : (
        <Comparison
          first={first}
          second={second}
          onOpen={onOpen}
          onSwap={onSwap}
        />
      )}
    </main>
  );
}

/* =========================
   COMPARE SELECTOR
========================= */

function CompareSelector({
  label,
  value,
  allPlayers,
  onChange,
  onRemove,
}) {
  return (
    <div className="compare-selector">
      <div className="compare-selector-label">
        {label}
      </div>

      <div className="filter-box">
        <select
          value={value}
          onChange={(event) => {
            const player = allPlayers.find(
              (item) =>
                String(item.id) === event.target.value
            );

            if (player) {
              onChange(player);
            }
          }}
        >
          <option value="">
            SELECT PLAYER
          </option>

          {allPlayers.map((player) => (
            <option
              key={player.id}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {value && (
        <button
          type="button"
          className="clear-button"
          onClick={onRemove}
        >
          × REMOVE
        </button>
      )}
    </div>
  );
}

/* =========================
   COMPARISON
========================= */

function Comparison({
  first,
  second,
  onOpen,
  onSwap,
}) {
  const bothGoalkeepers =
    first.position === "GK" &&
    second.position === "GK";

  const statGroups = [
    {
      title: "CORE",
      stats: [
        ["OVR", "overall"],
        ["META SCORE", "metaScore"],
      ],
    },
    {
      title: bothGoalkeepers
        ? "GOALKEEPING"
        : "ATTACK",
      stats: bothGoalkeepers
        ? [
            ["DIV", "pace"],
            ["HAN", "shooting"],
            ["KICK", "passing"],
            ["REF", "dribbling"],
          ]
        : [
            ["PAC", "pace"],
            ["SHO", "shooting"],
            ["PAS", "passing"],
            ["DRI", "dribbling"],
          ],
    },
    {
      title: "DEFENCE & PHYSICAL",
      stats: bothGoalkeepers
        ? [
            ["SPD", "defending"],
            ["POS", "physical"],
          ]
        : [
            ["DEF", "defending"],
            ["PHY", "physical"],
          ],
    },
  ];

  return (
    <div className="comparison-area">
      <div className="comparison-hero">
        <ComparisonPlayer
          player={first}
          onOpen={onOpen}
        />

        <div className="comparison-center">
          <div className="comparison-center-vs">
            VS
          </div>

          <button
            type="button"
            className="reset-button"
            onClick={onSwap}
          >
            ↔ SWAP PLAYERS
          </button>
        </div>

        <ComparisonPlayer
          player={second}
          onOpen={onOpen}
        />
      </div>

      <div className="comparison-summary">
        <SummaryCard
          label="META SCORE"
          firstValue={first.metaScore}
          secondValue={second.metaScore}
        />

        <SummaryCard
          label="OVERALL"
          firstValue={first.overall}
          secondValue={second.overall}
        />

        <SummaryCard
          label="SKILL MOVES"
          firstValue={`${first.skillMoves || 0}★`}
          secondValue={`${second.skillMoves || 0}★`}
        />

        <SummaryCard
          label="WEAK FOOT"
          firstValue={`${first.weakFoot || 0}★`}
          secondValue={`${second.weakFoot || 0}★`}
        />
      </div>

      {statGroups.map((group) => (
        <div
          className="comparison-group"
          key={group.title}
        >
          <div className="comparison-group-title">
            {group.title}
          </div>

          {group.stats.map(([label, key]) => (
            <ComparisonStat
              key={key}
              label={label}
              firstValue={Number(first[key]) || 0}
              secondValue={Number(second[key]) || 0}
            />
          ))}
        </div>
      ))}

      <div className="comparison-extra">
        <ComparisonExtra
          label="PREFERRED FOOT"
          firstValue={first.preferredFoot || "N/A"}
          secondValue={second.preferredFoot || "N/A"}
        />

        <ComparisonExtra
          label="HEIGHT"
          firstValue={`${first.height || 0} cm`}
          secondValue={`${second.height || 0} cm`}
        />

        <ComparisonExtra
          label="WEIGHT"
          firstValue={`${first.weight || 0} kg`}
          secondValue={`${second.weight || 0} kg`}
        />

        <ComparisonExtra
          label="WORK RATE"
          firstValue={first.attackingWorkRate || "N/A"}
          secondValue={second.attackingWorkRate || "N/A"}
        />
      </div>
    </div>
  );
}

/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  label,
  firstValue,
  secondValue,
}) {
  return (
    <div className="summary-card">
      <span>{label}</span>

      <div className="summary-values">
        <strong>{firstValue}</strong>

        <span>VS</span>

        <strong>{secondValue}</strong>
      </div>
    </div>
  );
}

/* =========================
   COMPARISON STAT
========================= */

function ComparisonStat({
  label,
  firstValue,
  secondValue,
}) {
  const difference = firstValue - secondValue;

  const firstWins = firstValue > secondValue;
  const secondWins = secondValue > firstValue;
  const tie = firstValue === secondValue;

  const firstWidth = Math.min(
    Math.max(firstValue, 0),
    100
  );

  const secondWidth = Math.min(
    Math.max(secondValue, 0),
    100
  );

  return (
    <div className="comparison-stat">
      <div className="comparison-stat-header">
        <span
          className={
            firstWins || tie
              ? "comparison-value winner"
              : "comparison-value"
          }
        >
          {firstValue}
        </span>

        <span className="comparison-stat-name">
          {label}
        </span>

        <span
          className={
            secondWins || tie
              ? "comparison-value winner"
              : "comparison-value"
          }
        >
          {secondValue}
        </span>
      </div>

      <div className="comparison-bars">
        <div className="comparison-bar left">
          <div
            className={
              firstWins
                ? "comparison-fill winner-fill"
                : "comparison-fill"
            }
            style={{
              width: `${firstWidth}%`,
            }}
          />
        </div>

        <div className="comparison-bar right">
          <div
            className={
              secondWins
                ? "comparison-fill winner-fill"
                : "comparison-fill"
            }
            style={{
              width: `${secondWidth}%`,
            }}
          />
        </div>
      </div>

      <div className="comparison-difference">
        {tie ? (
          <span>TIE</span>
        ) : firstWins ? (
          <span>
            PLAYER 1 +{difference}
          </span>
        ) : (
          <span>
            PLAYER 2 +{Math.abs(difference)}
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================
   COMPARISON PLAYER
========================= */

function ComparisonPlayer({
  player,
  onOpen,
}) {
  if (!player) {
    return null;
  }

  return (
    <button
      type="button"
      className="comparison-player"
      onClick={() => onOpen(player)}
    >
      <div className="comparison-player-image">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
          />
        ) : (
          <span>
            {player.name?.charAt(0) || "?"}
          </span>
        )}
      </div>

      <div className="comparison-player-info">
        <strong>{player.name}</strong>

        <span>
          {player.position} • OVR {player.overall}
        </span>

        <small>
          {player.nation} • {player.club}
        </small>

        <small>
          META {player.metaScore} • {player.tier} TIER
        </small>
      </div>
    </button>
  );
}

/* =========================
   EXTRA COMPARISON INFO
========================= */

function ComparisonExtra({
  label,
  firstValue,
  secondValue,
}) {
  return (
    <div className="comparison-extra-card">
      <span>{label}</span>

      <strong>{firstValue}</strong>

      <span>VS</span>

      <strong>{secondValue}</strong>
    </div>
  );
}

/* =========================
   PLAYER DETAILS
========================= */

function PlayerDetails({
  player,
  onBack,
  onCompare,
}) {
  const isGK = player.position === "GK";

  const attributes = isGK
    ? [
        ["DIV", player.pace],
        ["HAN", player.shooting],
        ["KICK", player.passing],
        ["REF", player.dribbling],
        ["SPD", player.defending],
        ["POS", player.physical],
      ]
    : [
        ["PAC", player.pace],
        ["SHO", player.shooting],
        ["PAS", player.passing],
        ["DRI", player.dribbling],
        ["DEF", player.defending],
        ["PHY", player.physical],
      ];

  return (
    <main className="player-details-page">
      <div className="player-details-topbar">
        <button
          type="button"
          className="clear-button"
          onClick={onBack}
        >
          ← BACK TO PLAYERS
        </button>

        <div className="player-details-label">
          FC27 PLAYER PROFILE
        </div>
      </div>

      <section className="player-profile-hero">
        <div className="profile-background-glow" />

        <div className="profile-player-image">
          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
            />
          ) : (
            <div className="profile-image-placeholder">
              {player.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div className="profile-main-info">
          <div className="profile-kicker">
            {player.position} • FC27
          </div>

          <h1>{player.name}</h1>

          <div className="profile-meta-line">
            <span>{player.nation}</span>
            <span>•</span>
            <span>{player.league}</span>
            <span>•</span>
            <span>{player.club}</span>
          </div>

          <div className="profile-rating-row">
            <div className="profile-rating">
              <small>OVR</small>
              <strong>{player.overall}</strong>
            </div>

            <div className="profile-tier">
              <small>META TIER</small>
              <strong>{player.tier}</strong>
            </div>
          </div>

          <button
            type="button"
            className="profile-compare-button"
            onClick={() => onCompare(player)}
          >
            ⚔ ADD TO COMPARE
          </button>
        </div>

        <div className="profile-meta-card">
          <div className="profile-meta-label">
            META SCORE
          </div>

          <div className="profile-meta-number">
            {player.metaScore}
          </div>

          <div className="profile-meta-tier">
            {player.tier} TIER
          </div>

          <div className="profile-meta-line-small">
            FC27 META RATING
          </div>
        </div>
      </section>

      <section className="player-profile-content">
        <div className="profile-section-heading">
          <span>01</span>
          <div>
            <small>META ANALYSIS</small>
            <h2>SCORE BREAKDOWN</h2>
          </div>
        </div>

        <MetaBreakdown player={player} />

        <div className="profile-section-heading">
          <span>02</span>
          <div>
            <small>PLAYER ATTRIBUTES</small>
            <h2>BASE STATS</h2>
          </div>
        </div>

        <div className="profile-stats-panel">
          {attributes.map(([label, value]) => (
            <ProfileStat
              key={label}
              label={label}
              value={value}
            />
          ))}
        </div>

        <div className="profile-section-heading">
          <span>03</span>
          <div>
            <small>PLAYER INFORMATION</small>
            <h2>DETAILS</h2>
          </div>
        </div>

        <div className="profile-info-grid">
          <ProfileInfo
            label="POSITION"
            value={player.position}
          />

          <ProfileInfo
            label="ALTERNATE POSITIONS"
            value={player.alternatePositions || "N/A"}
          />

          <ProfileInfo
            label="PREFERRED FOOT"
            value={player.preferredFoot || "N/A"}
          />

          <ProfileInfo
            label="SKILL MOVES"
            value={`${player.skillMoves || 0}★`}
          />

          <ProfileInfo
            label="WEAK FOOT"
            value={`${player.weakFoot || 0}★`}
          />

          <ProfileInfo
            label="HEIGHT"
            value={`${player.height || 0} cm`}
          />

          <ProfileInfo
            label="WEIGHT"
            value={`${player.weight || 0} kg`}
          />

          <ProfileInfo
            label="ATTACKING WORK RATE"
            value={player.attackingWorkRate || "N/A"}
          />

          <ProfileInfo
            label="DEFENSIVE WORK RATE"
            value={player.defensiveWorkRate || "N/A"}
          />
        </div>

        <div className="profile-section-heading">
          <span>04</span>
          <div>
            <small>CLUB & COUNTRY</small>
            <h2>IDENTITY</h2>
          </div>
        </div>

        <div className="profile-identity-grid">
          <div className="identity-card">
            <span>NATION</span>
            <strong>{player.nation}</strong>
          </div>

          <div className="identity-card">
            <span>CLUB</span>
            <strong>{player.club}</strong>
          </div>

          <div className="identity-card">
            <span>LEAGUE</span>
            <strong>{player.league}</strong>
          </div>

          <div className="identity-card">
            <span>OVERALL RATING</span>
            <strong>{player.overall}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetaBreakdown({ player }) {
  const isGK = player.position === "GK";

  const rows = isGK
    ? [
        ["DIVING", player.pace, 0.2],
        ["HANDLING", player.shooting, 0.15],
        ["KICKING", player.passing, 0.15],
        ["REFLEXES", player.dribbling, 0.2],
        ["SPEED", player.defending, 0.1],
        ["POSITIONING", player.physical, 0.1],
        ["OVERALL", player.overall, 0.1],
      ]
    : [
        ["PACE", player.pace, 0.2],
        ["SHOOTING", player.shooting, 0.15],
        ["PASSING", player.passing, 0.15],
        ["DRIBBLING", player.dribbling, 0.2],
        ["DEFENDING", player.defending, 0.1],
        ["PHYSICAL", player.physical, 0.1],
        ["OVERALL", player.overall, 0.1],
      ];

  const skillBonus =
    Number(player.skillMoves) >= 5
      ? 3
      : Number(player.skillMoves) >= 4
        ? 2
        : 0;

  const weakFootBonus =
    Number(player.weakFoot) >= 5
      ? 2
      : Number(player.weakFoot) >= 4
        ? 1
        : 0;

  return (
    <div className="meta-breakdown">
      <div className="meta-breakdown-head">
        <div>
          <span className="meta-engine-label">
            FC27 META ENGINE
          </span>

          <h3>HOW THIS SCORE IS BUILT</h3>

          <p>
            Core attributes weighted by their importance
            to the META score.
          </p>
        </div>

        <div className="meta-engine-score">
          <small>META SCORE</small>
          <strong>{player.metaScore}</strong>
          <span>{player.tier} TIER</span>
        </div>
      </div>

      <div className="meta-breakdown-divider" />

      <div className="meta-breakdown-list">
        {rows.map(([label, value, weight]) => {
          const statValue = Math.min(
            Math.max(Number(value) || 0, 0),
            100
          );

          const contribution = Math.round(
            statValue * weight
          );

          return (
            <div
              className="meta-engine-row"
              key={label}
            >
              <div className="meta-engine-row-top">
                <div className="meta-engine-name">
                  <span>{label}</span>
                  <small>
                    {Math.round(weight * 100)}% WEIGHT
                  </small>
                </div>

                <div className="meta-engine-values">
                  <strong>{statValue}</strong>
                  <span>+{contribution}</span>
                </div>
              </div>

              <div className="meta-engine-track">
                <div
                  className="meta-engine-fill"
                  style={{
                    width: `${statValue}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="meta-bonus-section">
        <div className="meta-bonus-heading">
          <span>02</span>

          <div>
            <small>ADDITIONAL VALUE</small>
            <strong>META BONUSES</strong>
          </div>
        </div>

        <div className="meta-bonus-grid">
          <div className="meta-bonus-card">
            <div className="meta-bonus-icon">★</div>

            <div className="meta-bonus-info">
              <span>SKILL MOVES</span>
              <small>
                {player.skillMoves || 0}★ SKILL MOVES
              </small>
            </div>

            <strong
              className={
                skillBonus > 0 ? "active" : ""
              }
            >
              +{skillBonus}
            </strong>
          </div>

          <div className="meta-bonus-card">
            <div className="meta-bonus-icon">✦</div>

            <div className="meta-bonus-info">
              <span>WEAK FOOT</span>
              <small>
                {player.weakFoot || 0}★ WEAK FOOT
              </small>
            </div>

            <strong
              className={
                weakFootBonus > 0 ? "active" : ""
              }
            >
              +{weakFootBonus}
            </strong>
          </div>
        </div>
      </div>

      <div className="meta-engine-footer">
        <span>SCORING MODEL</span>
        <div />
        <strong>FC27 META SCORE / 100</strong>
      </div>
    </div>
  );
}

function ProfileStat({
  label,
  value,
}) {
  const numericValue = Number(value) || 0;

  return (
    <div className="profile-stat">
      <div className="profile-stat-top">
        <span>{label}</span>

        <strong>{numericValue}</strong>
      </div>

      <div className="profile-stat-track">
        <div
          className="profile-stat-fill"
          style={{
            width: `${Math.min(
              Math.max(numericValue, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function ProfileInfo({
  label,
  value,
}) {
  return (
    <div className="profile-info-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
export default App;