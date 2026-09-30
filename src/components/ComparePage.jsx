import CompareSelector from "./CompareSelector";
import Comparison from "./Comparison";

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
    <main className="compare-page">
      <div className="hero-top">
        <div className="gold-line" />
        <div className="hero-label">FC27 PLAYER COMPARE</div>
        <div className="gold-line" />
      </div>

      <section className="compare-header section-header">
        <div>
          <div className="section-label">PLAYER COMPARISON</div>
          <h2>FC27 PLAYER COMPARE</h2>
        </div>

        <div className="database-counter">
          <span className="counter-number">{allPlayers.length}</span>
          <span className="counter-text">PLAYERS</span>
        </div>
      </section>

      <p className="compare-subtitle">Compare two FC27 Ultimate Team players side by side.</p>

      <section className="compare-selectors">
        <CompareSelector
          label="PLAYER 1"
          value={first ? String(first.id) : ""}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(0, player)}
          onRemove={() => onRemove(0)}
        />

        <CompareSelector
          label="PLAYER 2"
          value={second ? String(second.id) : ""}
          allPlayers={allPlayers}
          onChange={(player) => onSelect(1, player)}
          onRemove={() => onRemove(1)}
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
        <div className="empty-state">
          <h3>
            {first || second
              ? "Select one more player"
              : allPlayers.length >= 2
                ? "Select two players"
                : "No players available"}
          </h3>

          <p>
            {allPlayers.length >= 2
              ? "Choose two FC27 players above to compare their stats and META scores."
              : "There are not enough players in the current database to run a comparison."}
          </p>
        </div>
      )}
    </main>
  );
}

export default ComparePage;
