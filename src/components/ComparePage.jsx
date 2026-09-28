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
      <section className="compare-header">
        <div>
          <div className="section-label">
            PLAYER COMPARISON
          </div>

          <h1>COMPARE FC27 PLAYERS</h1>

          <p>
            Select two players to compare their stats and META
            scores.
          </p>
        </div>
      </section>

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
          <div className="empty-symbol">⚔</div>

          <h3>
            {first || second
              ? "Select one more player"
              : "Select two players"}
          </h3>

          <p>
            Choose two FC27 players above to start comparing
            their stats.
          </p>
        </div>
      )}
    </main>
  );
}

export default ComparePage;
