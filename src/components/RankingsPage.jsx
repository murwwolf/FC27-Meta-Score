import PlayerCard from "./PlayerCard";
import { useMemo, useState } from "react";

function RankingsPage({
  players,
  onOpen,
  onCompare,
}) {
  const [category, setCategory] = useState("overall");
  const [sortBy, setSortBy] = useState("metaScore");

  const rankedPlayers = useMemo(() => {
    const categoryPlayers = players.filter((player) => {
      const position = String(player.position || "").toUpperCase();
      if (category === "attackers") return ["ST", "CF", "LW", "RW", "LM", "RM"].includes(position);
      if (category === "midfielders") return ["CAM", "CM", "CDM"].includes(position);
      if (category === "defenders") return ["CB", "LB", "RB", "LWB", "RWB"].includes(position);
      if (category === "goalkeepers") return position === "GK";
      return true;
    });

    return [...categoryPlayers].sort((a, b) => {
      const left = a[sortBy];
      const right = b[sortBy];
      return sortBy === "name"
        ? String(left || "").localeCompare(String(right || ""))
        : (Number(right) || 0) - (Number(left) || 0);
    });
  }, [players, category, sortBy]);

  const categories = [
    ["overall", "OVERALL"],
    ["attackers", "ATTACKERS"],
    ["midfielders", "MIDFIELDERS"],
    ["defenders", "DEFENDERS"],
    ["goalkeepers", "GOALKEEPERS"],
  ];

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

          <h2>{categories.find(([value]) => value === category)?.[1]} META RANKINGS</h2>
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

      <div className="ranking-toolbar">
        <div className="ranking-tabs" role="tablist" aria-label="Ranking category">
          {categories.map(([value, label]) => (
            <button key={value} type="button" role="tab" aria-selected={category === value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>
              {label}
            </button>
          ))}
        </div>
        <label className="ranking-sort">
          <span>SORT BY</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="metaScore">META SCORE</option>
            <option value="overall">OVERALL</option>
            <option value="pace">PAC</option>
            <option value="shooting">SHO</option>
            <option value="passing">PAS</option>
            <option value="dribbling">DRI</option>
            <option value="defending">DEF</option>
            <option value="physical">PHY</option>
            <option value="name">NAME</option>
          </select>
        </label>
      </div>

      {rankedPlayers.length === 0 ? (
        <div className="empty-state"><h3>No players in this ranking</h3><p>There are no matching players in this category.</p></div>
      ) : (
      <div className="players-grid ranking-grid">
        {rankedPlayers.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            onOpen={onOpen}
            onCompare={onCompare}
            rank={index + 1}
          />
        ))}
      </div>
      )}
    </main>
  );
}

export default RankingsPage;
