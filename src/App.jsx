import { useMemo, useState } from "react";

import "country-flag-icons/3x2/flags.css";

import players from "./lib/playerData";
import PlayerCard from "./components/PlayerCard";
import PlayersPage from "./components/PlayersPage";
import RankingsPage from "./components/RankingsPage";
import PlayerDetails from "./components/PlayerDetails";
import CompareSelector from "./components/CompareSelector";
import Comparison from "./components/Comparison";
import ComparePage from "./components/ComparePage";

import { calculateMetaScore, getTier } from "./lib/meta/metaScore";

const countryCodes = {
  England: "GB",
  Scotland: "GB",
  Wales: "GB",
  "Northern Ireland": "GB",
  Brazil: "BR",
  Argentina: "AR",
  France: "FR",
  Spain: "ES",
  Portugal: "PT",
  Germany: "DE",
  Italy: "IT",
  Netherlands: "NL",
  Belgium: "BE",
  Croatia: "HR",
  Serbia: "RS",
  Norway: "NO",
  Sweden: "SE",
  Denmark: "DK",
  Poland: "PL",
  Ukraine: "UA",
  Austria: "AT",
  Switzerland: "CH",
  Turkey: "TR",
  Greece: "GR",
  Romania: "RO",
  Hungary: "HU",
  "Czech Republic": "CZ",
  Morocco: "MA",
  Algeria: "DZ",
  Egypt: "EG",
  Senegal: "SN",
  Ghana: "GH",
  Nigeria: "NG",
  Cameroon: "CM",
  Mali: "ML",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  Tunisia: "TN",
  "South Africa": "ZA",
  Colombia: "CO",
  Uruguay: "UY",
  Chile: "CL",
  Ecuador: "EC",
  Peru: "PE",
  Paraguay: "PY",
  Venezuela: "VE",
  USA: "US",
  Canada: "CA",
  Mexico: "MX",
  Japan: "JP",
  "South Korea": "KR",
  Korea: "KR",
  China: "CN",
  Australia: "AU",
  India: "IN",
  "Saudi Arabia": "SA",
  Qatar: "QA",
};

function getCountryCode(country) {
  return countryCodes[country] || "";
}

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

/* =========================
   PLAYERS PAGE
========================= */

/* =========================
   RANKINGS
========================= */

/* =========================
   COMPARE PAGE
========================= */

export default App;











