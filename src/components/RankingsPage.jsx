import PlayerCard from "./PlayerCard";

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

export default RankingsPage;
