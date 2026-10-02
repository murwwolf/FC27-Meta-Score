import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import "country-flag-icons/3x2/flags.css";
import "./premium.css";
import players from "./lib/playerData";
import { calculateMetaScore, getTier } from "./lib/meta/metaScore";
import HomePage from "./components/HomePage";
import MetaScorePage from "./components/MetaScorePage";
import PlayersPage from "./components/PlayersPage";
import MetaFinderPage from "./components/MetaFinderPage";
import FavouritesPage from "./components/FavouritesPage";
import PlayerCollectionsProvider from "./components/PlayerCollectionsProvider";
import RankingsPage from "./components/RankingsPage";
import PlayerDetails from "./components/PlayerDetails";
import ComparePage from "./components/ComparePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import InstallHint from "./components/InstallHint";
import SignupModal from "./components/SignupModal";
import {
  FAVOURITES_STORAGE_KEY,
  RECENT_PLAYER_LIMIT,
  RECENT_STORAGE_KEY,
  readPlayerReferences,
  resolvePlayerReferences,
  writePlayerReferences,
} from "./lib/playerReferences";

const getOptions = (players, key) => ["All", ...new Set(players.map((player) => player[key]).filter(Boolean))]
  .sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));
const POSITION_ORDER = ["ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM", "LB", "LWB", "RB", "RWB", "CB", "GK"];
const normalizeSearch = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const PAGE_LABELS = {
  home: "HOME",
  players: "PLAYERS",
  "meta-finder": "META FINDER",
  favourites: "FAVOURITES",
  rankings: "RANKINGS",
  compare: "COMPARE",
  "meta-score": "METHODOLOGY",
};
const APP_PAGES = new Set([...Object.keys(PAGE_LABELS), "player"]);

function getRouteState() {
  const storedRoute = window.history.state?.fc27Route;
  if (storedRoute && APP_PAGES.has(storedRoute.page)) return storedRoute;

  const [page, playerId] = window.location.hash.slice(1).split("/");
  if (!APP_PAGES.has(page)) return { page: "home" };
  return page === "player"
    ? { page, playerId: playerId || "", returnPage: "players" }
    : { page };
}

function writeRouteState(route, replace = false) {
  const currentState = window.history.state;
  const state = currentState && typeof currentState === "object" ? currentState : {};
  const url = new URL(window.location.href);
  const routePath = route.page === "player"
    ? `player/${encodeURIComponent(String(route.playerId))}`
    : route.page;
  url.hash = routePath;
  window.history[replace ? "replaceState" : "pushState"](
    { ...state, fc27Route: route },
    "",
    url
  );
}

function AppShell() {
  const [page, setPage] = useState(() => getRouteState().page);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const openSignUp = useCallback(() => setSignUpOpen(true), []);
  const closeSignUp = useCallback(() => setSignUpOpen(false), []);
  const [returnPage, setReturnPage] = useState(() => getRouteState().returnPage || "players");
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [tier, setTier] = useState("All");
  const [minRating, setMinRating] = useState("0");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [clubFilter, setClubFilter] = useState("All");
  const [nationFilter, setNationFilter] = useState("All");
  const [cardTypeFilter, setCardTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("meta-desc");
  const [selectedPlayer, setSelectedPlayer] = useState(() => {
    const route = getRouteState();
    const player = route.page === "player"
      ? players.find((item) => String(item.id) === String(route.playerId))
      : null;
    if (!player) return null;
    const metaScore = calculateMetaScore(player);
    return { ...player, metaScore, tier: getTier(metaScore) };
  });
  const [favouriteIds, setFavouriteIds] = useState(() => readPlayerReferences(FAVOURITES_STORAGE_KEY, players));
  const [recentPlayerIds, setRecentPlayerIds] = useState(() => readPlayerReferences(RECENT_STORAGE_KEY, players, RECENT_PLAYER_LIMIT));
  const [comparePlayers, setComparePlayers] = useState(() => players.slice(0, 2).map((player) => {
    const metaScore = calculateMetaScore(player);
    return { ...player, metaScore, tier: getTier(metaScore) };
  }));

  const scoredPlayers = useMemo(() => players.map((player) => {
    const metaScore = calculateMetaScore(player);
    return { ...player, metaScore, tier: getTier(metaScore) };
  }), []);

  useLayoutEffect(() => {
    const route = getRouteState();
    if (route.page === "player" && !players.some((player) => String(player.id) === String(route.playerId))) {
      writeRouteState({ page: "home" }, true);
      return;
    }
    writeRouteState(route, true);
  }, []);

  useEffect(() => {
    function restoreRoute(event) {
      const route = event.state?.fc27Route || getRouteState();
      const isValidPage = APP_PAGES.has(route.page);
      const requestedPage = isValidPage ? route.page : "home";
      const nextPlayer = requestedPage === "player"
        ? scoredPlayers.find((player) => String(player.id) === String(route.playerId)) || null
        : null;
      const nextPage = requestedPage === "player" && !nextPlayer ? "home" : requestedPage;

      setPage(nextPage);
      setReturnPage(route.returnPage || "players");
      setSelectedPlayer(nextPlayer);
    }

    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, [scoredPlayers]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    if (window.getComputedStyle(root).scrollBehavior === "auto") window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }, [page]);

  useEffect(() => {
    writePlayerReferences(FAVOURITES_STORAGE_KEY, favouriteIds);
  }, [favouriteIds]);

  useEffect(() => {
    writePlayerReferences(RECENT_STORAGE_KEY, recentPlayerIds.slice(0, RECENT_PLAYER_LIMIT));
  }, [recentPlayerIds]);

  const favouriteIdSet = useMemo(() => new Set(favouriteIds.map(String)), [favouriteIds]);
  const toggleFavourite = useCallback((id) => {
    setFavouriteIds((current) => current.some((item) => String(item) === String(id))
      ? current.filter((item) => String(item) !== String(id))
      : [...current, id]);
  }, []);
  const collectionContext = useMemo(() => ({
    isFavourite: (id) => favouriteIdSet.has(String(id)),
    toggleFavourite,
  }), [favouriteIdSet, toggleFavourite]);
  const favouritePlayers = useMemo(
    () => resolvePlayerReferences(favouriteIds, scoredPlayers),
    [favouriteIds, scoredPlayers]
  );
  const recentPlayers = useMemo(
    () => resolvePlayerReferences(recentPlayerIds, scoredPlayers, RECENT_PLAYER_LIMIT),
    [recentPlayerIds, scoredPlayers]
  );

  const filteredPlayers = useMemo(() => {
    const query = normalizeSearch(search.trim());
    const result = scoredPlayers.filter((player) => {
      const matchesQuery = !query || normalizeSearch(player.name).includes(query);
      return matchesQuery &&
        (position === "All" || player.position === position) &&
        (tier === "All" || player.tier === tier) &&
        Number(player.overall) >= Number(minRating) &&
        (leagueFilter === "All" || player.league === leagueFilter) &&
        (clubFilter === "All" || player.club === clubFilter) &&
        (nationFilter === "All" || player.nation === nationFilter) &&
        (cardTypeFilter === "All" || player.cardType === cardTypeFilter || player.promoName === cardTypeFilter);
    });
    const sortFields = {
      "meta-desc": ["metaScore", "desc"], "meta-asc": ["metaScore", "asc"],
      "ovr-desc": ["overall", "desc"], "ovr-asc": ["overall", "asc"],
      "name-asc": ["name", "asc"], "name-desc": ["name", "desc"],
      "pac-desc": ["pace", "desc"], "pac-asc": ["pace", "asc"],
      "sho-desc": ["shooting", "desc"], "sho-asc": ["shooting", "asc"],
      "pas-desc": ["passing", "desc"], "pas-asc": ["passing", "asc"],
      "dri-desc": ["dribbling", "desc"], "dri-asc": ["dribbling", "asc"],
      "def-desc": ["defending", "desc"], "def-asc": ["defending", "asc"],
      "phy-desc": ["physical", "desc"], "phy-asc": ["physical", "asc"],
    };
    const [sortField, direction] = sortFields[sortBy] || sortFields["meta-desc"];
    const sortDirection = direction === "asc" ? -1 : 1;
    return result.sort((left, right) => {
      const primary = sortField === "name"
        ? String(left.name || "").localeCompare(String(right.name || "")) * (direction === "asc" ? 1 : -1)
        : (Number(right[sortField] || 0) - Number(left[sortField] || 0)) * sortDirection;
      if (primary !== 0) return primary;
      const overall = Number(right.overall || 0) - Number(left.overall || 0);
      return overall || String(left.name || "").localeCompare(String(right.name || ""));
    });
  }, [scoredPlayers, search, position, tier, minRating, leagueFilter, clubFilter, nationFilter, cardTypeFilter, sortBy]);

  const positions = useMemo(() => {
    const existing = new Set(scoredPlayers.map((player) => String(player.position || "").trim().toUpperCase()).filter(Boolean));
    return ["All", ...POSITION_ORDER.filter((item) => existing.has(item)), ...[...existing].filter((item) => !POSITION_ORDER.includes(item)).sort()];
  }, [scoredPlayers]);
  const leagues = useMemo(() => getOptions(scoredPlayers, "league"), [scoredPlayers]);
  const clubs = useMemo(() => getOptions(scoredPlayers, "club"), [scoredPlayers]);
  const nations = useMemo(() => getOptions(scoredPlayers, "nation"), [scoredPlayers]);
  const cardTypes = useMemo(() => ["All", ...new Set(scoredPlayers.flatMap((player) => [player.cardType, player.promoName]).filter(Boolean))]
    .sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)), [scoredPlayers]);
  const overallOptions = useMemo(() => [...new Set(scoredPlayers.map((player) => Number(player.overall)).filter((rating) => Number.isFinite(rating) && rating >= 80))].sort((a, b) => a - b), [scoredPlayers]);

  function openPlayer(player) {
    const nextReturnPage = page === "player" ? returnPage : page;
    setReturnPage(nextReturnPage);
    setRecentPlayerIds((current) => [
      player.id,
      ...current.filter((id) => String(id) !== String(player.id)),
    ].slice(0, RECENT_PLAYER_LIMIT));
    setSelectedPlayer(player);
    setPage("player");
    writeRouteState({ page: "player", playerId: player.id, returnPage: nextReturnPage });
  }
  function navigateToPage(nextPage) {
    setPage(nextPage);
    setSelectedPlayer(null);
    if (nextPage !== page) writeRouteState({ page: nextPage });
  }
  function goHome() { navigateToPage("home"); }
  function goBackFromPlayer() {
    const previousPage = returnPage || "players";
    if (window.history.length > 1 && page === "player") {
      window.history.back();
      return;
    }
    setPage(previousPage);
    setSelectedPlayer(null);
    writeRouteState({ page: previousPage }, true);
  }
  function clearFilters() {
    setSearch(""); setPosition("All"); setTier("All"); setMinRating("0");
    setSortBy("meta-desc"); setLeagueFilter("All"); setClubFilter("All");
    setNationFilter("All"); setCardTypeFilter("All");
  }
  function addToCompare(player) {
    setComparePlayers((current) => {
      if (current.some((item) => item?.id === player.id)) return current;
      return current.length >= 2 ? [current[1], player] : [...current, player];
    });
    setPage("compare"); setSelectedPlayer(null);
    if (page !== "compare") writeRouteState({ page: "compare" });
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
  function resetComparePlayers() { setComparePlayers([null, null]); }

  return (
    <PlayerCollectionsProvider value={collectionContext}>
      <>
        <SplashScreen />
        <InstallHint />
        <div className="app">
          <div className="background-grid" />
          <div className="red-glow red-glow-one" />
          <div className="red-glow red-glow-two" />
          <Navbar page={page === "player" ? returnPage : page} setPage={navigateToPage} onHome={goHome} onSignUp={openSignUp} />

        {page === "home" && <HomePage
          scoredPlayers={scoredPlayers}
          search={search}
          setSearch={setSearch}
          onNavigate={navigateToPage}
          onOpen={openPlayer}
          onCompare={addToCompare}
          favouritePlayers={favouritePlayers}
          recentPlayers={recentPlayers}
        />}
        {page === "meta-score" && <MetaScorePage players={scoredPlayers} onNavigate={navigateToPage} onOpen={openPlayer} onCompare={addToCompare} />}
        {page === "players" && <PlayersPage
          players={filteredPlayers} search={search} setSearch={setSearch}
          position={position} setPosition={setPosition} tier={tier} setTier={setTier}
          leagueFilter={leagueFilter} setLeagueFilter={setLeagueFilter}
          clubFilter={clubFilter} setClubFilter={setClubFilter}
          nationFilter={nationFilter} setNationFilter={setNationFilter}
          cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter} cardTypes={cardTypes}
          minRating={minRating} setMinRating={setMinRating} overallOptions={overallOptions} sortBy={sortBy} setSortBy={setSortBy}
          positions={positions} leagues={leagues} clubs={clubs} nations={nations}
          onOpen={openPlayer} onCompare={addToCompare} onClear={clearFilters} totalPlayers={scoredPlayers.length}
        />}
        {page === "meta-finder" && <MetaFinderPage players={scoredPlayers} onOpen={openPlayer} onCompare={addToCompare} />}
        {page === "favourites" && <FavouritesPage players={favouritePlayers} onOpen={openPlayer} onCompare={addToCompare} onNavigate={setPage} />}
        {page === "rankings" && <RankingsPage players={scoredPlayers} onOpen={openPlayer} onCompare={addToCompare} />}
        {page === "compare" && <ComparePage players={comparePlayers} allPlayers={scoredPlayers} onSelect={selectComparePlayer} onRemove={removeComparePlayer} onSwap={swapComparePlayers} onReset={resetComparePlayers} onOpen={openPlayer} />}
        {page === "player" && selectedPlayer && <PlayerDetails
          player={selectedPlayer}
          backLabel={PAGE_LABELS[returnPage] || PAGE_LABELS.players}
          onBack={goBackFromPlayer}
          onCompare={addToCompare}
        />}
          <Footer />
          {signUpOpen && <SignupModal onClose={closeSignUp} />}
        </div>
      </>
    </PlayerCollectionsProvider>
  );
}

export default AppShell;