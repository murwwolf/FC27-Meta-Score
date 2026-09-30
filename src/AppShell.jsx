import { useMemo, useState } from "react";
import "country-flag-icons/3x2/flags.css";
import "./premium.css";
import players from "./lib/playerData";
import { calculateMetaScore, getTier } from "./lib/meta/metaScore";
import PlayerCard from "./components/PlayerCard";
import PlayersPage from "./components/PlayersPage";
import RankingsPage from "./components/RankingsPage";
import PlayerDetails from "./components/PlayerDetails";
import ComparePage from "./components/ComparePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const getOptions = (players, key) => ["All", ...new Set(players.map((player) => player[key]).filter(Boolean))]
  .sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));

function AppShell() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [tier, setTier] = useState("All");
  const [minRating, setMinRating] = useState("All");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [clubFilter, setClubFilter] = useState("All");
  const [nationFilter, setNationFilter] = useState("All");
  const [cardTypeFilter, setCardTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("meta-desc");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [comparePlayers, setComparePlayers] = useState([]);

  const scoredPlayers = useMemo(() => players.map((player) => {
    const metaScore = calculateMetaScore(player);
    return { ...player, metaScore, tier: getTier(metaScore) };
  }), []);

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = scoredPlayers.filter((player) => {
      const matchesQuery = !query || [player.name, player.club, player.nation, player.position, player.league]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
      return matchesQuery &&
        (position === "All" || player.position === position) &&
        (tier === "All" || player.tier === tier) &&
        (minRating === "All" || Number(player.overall) >= Number(minRating)) &&
        (leagueFilter === "All" || player.league === leagueFilter) &&
        (clubFilter === "All" || player.club === clubFilter) &&
        (nationFilter === "All" || player.nation === nationFilter) &&
        (cardTypeFilter === "All" || (player.cardType || player.promoName || "Base") === cardTypeFilter);
    });
    const sorters = {
      "meta-desc": (a, b) => b.metaScore - a.metaScore,
      "meta-asc": (a, b) => a.metaScore - b.metaScore,
      "ovr-desc": (a, b) => b.overall - a.overall,
      "ovr-asc": (a, b) => a.overall - b.overall,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "pace-desc": (a, b) => b.pace - a.pace,
      "pac-desc": (a, b) => b.pace - a.pace,
      "shooting-desc": (a, b) => b.shooting - a.shooting,
      "sho-desc": (a, b) => b.shooting - a.shooting,
      "passing-desc": (a, b) => b.passing - a.passing,
      "pas-desc": (a, b) => b.passing - a.passing,
      "dribbling-desc": (a, b) => b.dribbling - a.dribbling,
      "dri-desc": (a, b) => b.dribbling - a.dribbling,
      "defending-desc": (a, b) => b.defending - a.defending,
      "def-desc": (a, b) => b.defending - a.defending,
      "physical-desc": (a, b) => b.physical - a.physical,
      "phy-desc": (a, b) => b.physical - a.physical,
    };
    return result.sort(sorters[sortBy] || sorters["meta-desc"]);
  }, [scoredPlayers, search, position, tier, minRating, leagueFilter, clubFilter, nationFilter, cardTypeFilter, sortBy]);

  const positions = useMemo(() => ["All", ...new Set(scoredPlayers.map((player) => player.position).filter(Boolean))], [scoredPlayers]);
  const leagues = useMemo(() => getOptions(scoredPlayers, "league"), [scoredPlayers]);
  const clubs = useMemo(() => getOptions(scoredPlayers, "club"), [scoredPlayers]);
  const nations = useMemo(() => getOptions(scoredPlayers, "nation"), [scoredPlayers]);
  const cardTypes = useMemo(() => ["All", ...new Set(scoredPlayers.map((player) => player.cardType || player.promoName || "Base"))]
    .sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)), [scoredPlayers]);

  function openPlayer(player) { setSelectedPlayer(player); setPage("player"); }
  function goHome() { setPage("home"); setSelectedPlayer(null); }
  function clearFilters() {
    setSearch(""); setPosition("All"); setTier("All"); setMinRating("All");
    setSortBy("meta-desc"); setLeagueFilter("All"); setClubFilter("All");
    setNationFilter("All"); setCardTypeFilter("All");
  }
  function addToCompare(player) {
    setComparePlayers((current) => {
      if (current.some((item) => item?.id === player.id)) return current;
      return current.length >= 2 ? [current[1], player] : [...current, player];
    });
    setPage("compare"); setSelectedPlayer(null);
  }
  function selectComparePlayer(index, player) {
    setComparePlayers((current) => {
      const next = [...current];
      while (next.length < 2) next.push(null);
      next[index] = player;
      return next;
    });
  }
  function removeComparePlayer(index) {
    setComparePlayers((current) => current.map((player, itemIndex) => itemIndex === index ? null : player));
  }
  function swapComparePlayers() { setComparePlayers((current) => [current[1] || null, current[0] || null]); }

  return (
    <div className="app">
      <div className="background-grid" />
      <div className="red-glow red-glow-one" />
      <div className="red-glow red-glow-two" />
      <Navbar page={page} setPage={(value) => { setPage(value); setSelectedPlayer(null); }} onHome={goHome} />

      {page === "home" && <main>
        <section className="hero home-hero">
          <div className="hero-top"><div className="gold-line" /><div className="hero-label">FC27 ULTIMATE TEAM</div><div className="gold-line" /></div>
          <div className="home-hero-copy">
            <h1>FC27 <span>META SCORE</span></h1>
            <h2>How META Is Your FC27 Player?</h2>
            <p className="hero-subtitle">Explore 178 real Ultimate Team players. We evaluate position-specific attributes and in-game traits to produce a META score built for squad decisions.</p>
            <div className="home-actions">
              <button type="button" className="primary-action" onClick={() => setPage("players")}>EXPLORE PLAYERS <span aria-hidden="true">→</span></button>
              <button type="button" className="secondary-action" onClick={() => setPage("rankings")}>VIEW RANKINGS <span aria-hidden="true">↗</span></button>
            </div>
          </div>
          <div className="filters"><div className="filter-box search-box">
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setPage("players"); }} placeholder="Search for an FC27 player..." />
            <button type="button" aria-label="Search players" onClick={() => setPage("players")}>SEARCH</button>
          </div></div>
        </section>
        <section className="players-section home-featured">
          <div className="section-header"><div><div className="section-label">THE CURRENT META</div><h2>TOP-RATED PLAYERS</h2></div>
            <div className="database-counter"><span className="counter-number">{scoredPlayers.length}</span><span className="counter-text">PLAYERS TRACKED</span></div>
            <button type="button" className="text-action" onClick={() => setPage("rankings")}>FULL RANKINGS <span aria-hidden="true">→</span></button>
          </div>
          <div className="players-grid">{[...scoredPlayers].sort((a, b) => b.metaScore - a.metaScore).slice(0, 3).map((player) => <PlayerCard key={player.id} player={player} onOpen={openPlayer} onCompare={addToCompare} />)}</div>
        </section>
      </main>}

      {page === "players" && <PlayersPage
        players={filteredPlayers} search={search} setSearch={setSearch}
        position={position} setPosition={setPosition} tier={tier} setTier={setTier}
        leagueFilter={leagueFilter} setLeagueFilter={setLeagueFilter}
        clubFilter={clubFilter} setClubFilter={setClubFilter}
        nationFilter={nationFilter} setNationFilter={setNationFilter}
        cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter} cardTypes={cardTypes}
        minRating={minRating} setMinRating={setMinRating} sortBy={sortBy} setSortBy={setSortBy}
        positions={positions} leagues={leagues} clubs={clubs} nations={nations}
        onOpen={openPlayer} onCompare={addToCompare} onClear={clearFilters}
      />}
      {page === "rankings" && <RankingsPage players={scoredPlayers} onOpen={openPlayer} onCompare={addToCompare} />}
      {page === "compare" && <ComparePage players={comparePlayers} allPlayers={scoredPlayers} onSelect={selectComparePlayer} onRemove={removeComparePlayer} onSwap={swapComparePlayers} onOpen={openPlayer} />}
      {page === "player" && selectedPlayer && <PlayerDetails player={selectedPlayer} onBack={() => { setPage("players"); setSelectedPlayer(null); }} onCompare={addToCompare} />}
      <Footer />
    </div>
  );
}

export default AppShell;