import PlayerCard from "./PlayerCard";

function FavouritesPage({ players, onOpen, onCompare, onNavigate }) {
  return (
    <main className="favourites-page">
      <header className="favourites-header">
        <div className="hero-top">
          <div className="gold-line" />
          <div className="hero-label">YOUR FC27 SHORTLIST</div>
          <div className="gold-line" />
        </div>
        <div className="favourites-title-row">
          <div>
            <span className="section-label">PERSONAL PLAYER COLLECTION</span>
            <h1><span aria-hidden="true">★</span> FAVOURITES</h1>
            <p>Your saved players, ready to scout, compare, or revisit.</p>
          </div>
          <div className="finder-database-count favourites-count" aria-label={`${players.length} favourite players`}>
            <strong>{players.length}</strong>
            <span>FAVOURITES</span>
          </div>
        </div>
      </header>

      {players.length === 0 ? (
        <section className="favourites-empty-state">
          <div className="favourites-empty-star" aria-hidden="true">★</div>
          <span className="section-label">YOUR SHORTLIST STARTS HERE</span>
          <h2>No favourites yet</h2>
          <p>Star players to build your personal shortlist.</p>
          <div>
            <button type="button" className="primary-action" onClick={() => onNavigate("players")}>BROWSE PLAYERS</button>
            <button type="button" className="secondary-action" onClick={() => onNavigate("meta-finder")}>OPEN META FINDER</button>
          </div>
        </section>
      ) : (
        <>
          <div className="favourites-results-bar" aria-live="polite">
            <span>{players.length} {players.length === 1 ? "PLAYER" : "PLAYERS"} SAVED</span>
            <span>USE THE STAR ON ANY CARD TO REMOVE IT</span>
          </div>
          <div className="favourites-player-grid">
            {players.map((player) => (
              <div className="favourite-result-card" key={player.id}>
                <PlayerCard player={player} onOpen={onOpen} onCompare={onCompare} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default FavouritesPage;
