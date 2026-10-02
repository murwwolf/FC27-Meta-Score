import CompareSelector from "./CompareSelector";
import Comparison from "./Comparison";

function ComparePage({
  players,
  allPlayers,
  onSelect,
  onRemove,
  onSwap,
  onReset,
  onOpen,
}) {
  const first = players[0] || null;
  const second = players[1] || null;

  return (
    <main className="compare-page">
      <div className="hero-top">
        <div className="gold-line" />
        <div className="hero-label">FC27 PLAYER COMPARE</div>
        <div className="gold-line" />
      </div>

      <section className="compare-header section-header">
        <div>
          <div className="section-label">SCOUT THE MATCHUP</div>
          <h2>PLAYER COMPARISON</h2>
        </div>

        <div className="compare-header-actions">
          <div className="database-counter">
            <span className="counter-number">{allPlayers.length}</span>
            <span className="counter-text">PLAYERS</span>
          </div>
          <button type="button" className="compare-reset-button" onClick={onReset}>
            RESET COMPARISON
          </button>
        </div>
      </section>

      <p className="compare-subtitle">Pick two players and put their META scores and attributes head to head.</p>

      <section className="compare-selectors">
        <CompareSelector
          label="PLAYER A"
          value={first ? String(first.id) : ""}
          excludedId={second?.id}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(0, player)}
          onRemove={() => onRemove(0)}
          onOpen={onOpen}
        />

        <CompareSelector
          label="PLAYER B"
          value={second ? String(second.id) : ""}
          excludedId={first?.id}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(1, player)}
          onRemove={() => onRemove(1)}
          onOpen={onOpen}
        />
      </section>

      {first && second ? (
        <Comparison
          first={first}
          second={second}
          onOpen={onOpen}
          onSwap={onSwap}
        />
      ) : (
        <section className="compare-empty-state" aria-live="polite">
          <span className="compare-empty-mark" aria-hidden="true">VS</span>
          <span className="section-label">BUILD YOUR MATCHUP</span>
          <h3>
            {first || second
              ? "One more player to go."
              : allPlayers.length >= 2
                ? "Choose your two players."
                : "No players available."}
          </h3>
          <p>
            {allPlayers.length >= 2
              ? "Search by name and select a player in each panel to compare their existing META scores and attributes."
              : "There are not enough players in the current database to run a comparison."}
          </p>
        </section>
      )}
    </main>
  );
}

export default ComparePage;
