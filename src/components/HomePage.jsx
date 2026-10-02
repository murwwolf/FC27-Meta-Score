import { useMemo } from "react";
import { getTier, META_SCORE_CONFIG } from "../lib/meta/metaScore";
import PlayerCard from "./PlayerCard";

function getTierRanges() {
  const scoresByTier = new Map();
  for (let score = META_SCORE_CONFIG.minimumScore; score <= META_SCORE_CONFIG.maximumScore; score += 1) {
    const tier = getTier(score);
    const scores = scoresByTier.get(tier) || [];
    scores.push(score);
    scoresByTier.set(tier, scores);
  }

  return ["S", "A", "B", "C", "D"].flatMap((tier) => {
    const scores = scoresByTier.get(tier);
    if (!scores?.length) return [];
    const lowest = scores[0];
    const highest = scores[scores.length - 1];
    return [{ tier, range: `${lowest}–${highest}` }];
  });
}

function HomePage({ scoredPlayers, search, setSearch, onNavigate, onOpen, onCompare, favouritePlayers = [], recentPlayers = [] }) {
  const topPlayers = useMemo(() => [...scoredPlayers].sort((left, right) => {
    const scoreDifference = Number(right.metaScore || 0) - Number(left.metaScore || 0);
    if (scoreDifference) return scoreDifference;
    const overallDifference = Number(right.overall || 0) - Number(left.overall || 0);
    return overallDifference || String(left.name || "").localeCompare(String(right.name || ""));
  }).slice(0, 5), [scoredPlayers]);

  const featuredPlayer = topPlayers[0] || null;
  const highestRatedPlayer = useMemo(() => [...scoredPlayers].sort((left, right) => {
    const overallDifference = Number(right.overall || 0) - Number(left.overall || 0);
    if (overallDifference) return overallDifference;
    const scoreDifference = Number(right.metaScore || 0) - Number(left.metaScore || 0);
    return scoreDifference || String(left.name || "").localeCompare(String(right.name || ""));
  })[0] || null, [scoredPlayers]);
  const availablePositions = useMemo(() => new Set(
    scoredPlayers.map((player) => String(player.position || "").trim().toUpperCase()).filter(Boolean)
  ).size, [scoredPlayers]);
  const tierRanges = useMemo(() => getTierRanges(), []);

  return (
    <main className="home-page">
      <section className="home-hero home-landing-hero">
        <div className="home-hero-pitch" aria-hidden="true" />
        <div className="home-landing-copy">
          <div className="home-live-badge"><span className="status-dot" /> LIVE DATABASE <b>{scoredPlayers.length.toLocaleString()} PLAYERS</b></div>
          <div className="hero-label home-kicker">FC27 ULTIMATE TEAM</div>
          <h1>FC27 <span>META</span></h1>
          <h2>HOW META IS YOUR<br />PLAYER?</h2>
          <p className="hero-subtitle">Calculate, compare and discover the players built for the FC27 META.</p>
          <div className="home-actions">
            <button type="button" className="primary-action" onClick={() => onNavigate("players")}>EXPLORE PLAYERS <span aria-hidden="true">→</span></button>
            <button type="button" className="secondary-action" onClick={() => onNavigate("rankings")}>VIEW RANKINGS <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        <div className="home-hero-index" aria-hidden="true">27</div>
        <div className="home-hero-footnote"><span>PLAYER DATA</span><i /> FC27 ULTIMATE TEAM</div>
      </section>

      {scoredPlayers.length === 0 ? (
        <section className="home-empty-state">
          <span>DATABASE EMPTY</span>
          <p>No player data is currently available.</p>
        </section>
      ) : (
        <>
          <section className="home-top-meta home-section" aria-labelledby="home-featured-meta-title">
            <header className="home-section-heading">
              <div><span className="section-label">THE CURRENT META</span><h2 id="home-featured-meta-title">FEATURED META PLAYERS</h2></div>
              <p>Explore the leading META scores across the player database.</p>
              <button type="button" className="text-action" onClick={() => onNavigate("rankings")}>FULL RANKINGS <span aria-hidden="true">→</span></button>
            </header>

            <div className="home-top-five">
              <div className="home-top-five-heading"><span>META LEADERBOARD</span><span>01—{String(topPlayers.length).padStart(2, "0")}</span></div>
              <div className="players-grid home-top-five-grid">
                {topPlayers.map((player, index) => (
                  <PlayerCard key={player.id} player={player} rank={index + 1} compact onOpen={onOpen} onCompare={onCompare} />
                ))}
              </div>
            </div>
          </section>

          <section className="home-database-overview home-section" aria-labelledby="home-database-title">
            <header className="home-section-heading">
              <div><span className="section-label">FC27 PLAYER DATABASE</span><h2 id="home-database-title">PLAYER DATABASE</h2></div>
              <p>See what is in the database and find the players that fit your squad.</p>
            </header>
            <section className="home-highlight-grid" aria-label="Database highlights">
              <button type="button" className="home-highlight-card home-highlight-player" onClick={() => onOpen(featuredPlayer)} aria-label={`View top META-rated player, ${featuredPlayer.name}, META ${featuredPlayer.metaScore}`}>
                <span className="home-highlight-label">TOP META-RATED PLAYER</span>
                <strong>{featuredPlayer.name || "Not listed"}</strong>
                <span className="home-highlight-bottom">
                  <span className="home-highlight-detail">{featuredPlayer.position || "—"} <i /> {featuredPlayer.tier || "—"} TIER</span>
                  <span className="home-highlight-score">{featuredPlayer.metaScore ?? "—"}<small>/100 META</small></span>
                </span>
                <span className="home-highlight-arrow" aria-hidden="true">↗</span>
              </button>
              <button type="button" className="home-highlight-card home-highlight-player home-highlight-overall" onClick={() => onOpen(highestRatedPlayer)} aria-label={`View highest-rated player, ${highestRatedPlayer.name}, overall ${highestRatedPlayer.overall}`}>
                <span className="home-highlight-label">HIGHEST-RATED PLAYER</span>
                <strong>{highestRatedPlayer.name || "Not listed"}</strong>
                <span className="home-highlight-bottom">
                  <span className="home-highlight-detail">{highestRatedPlayer.position || "—"} <i /> {highestRatedPlayer.tier || "—"} TIER</span>
                  <span className="home-highlight-score">{highestRatedPlayer.overall ?? "—"}<small>OVERALL</small></span>
                </span>
                <span className="home-highlight-arrow" aria-hidden="true">↗</span>
              </button>
              <div className="home-highlight-card">
                <span className="home-highlight-label">PLAYERS ANALYSED</span>
                <strong className="home-highlight-count">{scoredPlayers.length.toLocaleString()}</strong>
                <span className="home-highlight-detail">PLAYER CARDS IN THE DATABASE</span>
              </div>
              <div className="home-highlight-card">
                <span className="home-highlight-label">AVAILABLE POSITIONS</span>
                <strong className="home-highlight-count">{availablePositions}</strong>
                <span className="home-highlight-detail">UNIQUE PLAYING POSITIONS</span>
              </div>
            </section>
            <div className="home-find-player home-database-search">
              <div><span className="section-label">DATABASE SEARCH</span><h2>FIND YOUR PLAYER</h2><p>Search the FC27 database and discover their META score.</p></div>
              <form className="home-find-form" onSubmit={(event) => { event.preventDefault(); onNavigate("players"); }}>
                <label className="sr-only" htmlFor="home-player-search">Search players</label>
                <input id="home-player-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search players..." />
                <button type="submit" className="primary-action">SEARCH PLAYERS <span aria-hidden="true">→</span></button>
              </form>
            </div>
          </section>

          <section className="home-quick-actions home-section" aria-label="Explore rankings, compare players, and methodology">
            <header className="home-section-heading"><div><span className="section-label">BUILD YOUR NEXT SQUAD</span><h2>KEEP EXPLORING</h2></div></header>
            <div className="home-action-grid">
              <button type="button" className="home-action-card action-rankings" onClick={() => onNavigate("rankings")}>
                <span className="home-action-index">01</span><span className="home-action-arrow" aria-hidden="true">↗</span>
                <strong>VIEW RANKINGS</strong><span>See the current META leaderboard.</span>
              </button>
              <button type="button" className="home-action-card action-compare" onClick={() => onNavigate("compare")}>
                <span className="home-action-index">02</span><span className="home-action-arrow" aria-hidden="true">↗</span>
                <strong>COMPARE PLAYERS</strong><span>Compare two FC27 players side by side.</span>
              </button>
              <button type="button" className="home-action-card action-methodology" onClick={() => onNavigate("meta-score")}>
                <span className="home-action-index">03</span><span className="home-action-arrow" aria-hidden="true">↗</span>
                <strong>META METHODOLOGY</strong><span>See how position and attributes shape each score.</span>
              </button>
            </div>
          </section>

          <section className="home-meta-guide home-section">
            <div className="home-meta-guide-copy"><span className="section-label">POSITION-AWARE PLAYER RATINGS</span><h2>HOW DOES META SCORE WORK?</h2><p>Every player receives a META score out of 100 based on position-specific attributes and the existing FC27 META scoring system.</p></div>
            <div className="home-tier-scale" aria-label="Existing META score tiers">
              {tierRanges.map(({ tier, range }) => <div className={`home-tier-item tier-${tier.toLowerCase()}`} key={tier}><strong>{tier}</strong><span>{range}</span></div>)}
            </div>
          </section>

          {favouritePlayers.length > 0 || recentPlayers.length > 0 ? (
            <section className="home-my-players home-section" aria-labelledby="home-my-players-title">
              <header className="home-section-heading">
                <div><span className="section-label">YOUR PERSONAL SHORTLIST</span><h2 id="home-my-players-title">MY PLAYERS</h2></div>
                {favouritePlayers.length > 0 ? (
                  <button type="button" className="text-action" onClick={() => onNavigate("favourites")}>
                    ALL FAVOURITES <span aria-hidden="true">→</span>
                  </button>
                ) : null}
              </header>
              <div className="home-my-player-groups">
                {favouritePlayers.length > 0 ? (
                  <section className="home-my-player-group" aria-label="Favourite players">
                    <div className="home-my-player-group-heading"><span><i aria-hidden="true">★</i> FAVOURITES</span><span>{favouritePlayers.length} SAVED</span></div>
                    <div className="home-my-player-grid">
                      {favouritePlayers.slice(0, 3).map((player) => (
                        <PlayerCard key={player.id} player={player} compact onOpen={onOpen} onCompare={onCompare} />
                      ))}
                    </div>
                  </section>
                ) : null}
                {recentPlayers.length > 0 ? (
                  <section className="home-my-player-group" aria-label="Recently viewed players">
                    <div className="home-my-player-group-heading"><span><i aria-hidden="true">◷</i> RECENTLY VIEWED</span><span>LAST {recentPlayers.length}</span></div>
                    <div className="home-my-player-grid">
                      {recentPlayers.slice(0, 3).map((player) => (
                        <PlayerCard key={player.id} player={player} compact onOpen={onOpen} onCompare={onCompare} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}

export default HomePage;