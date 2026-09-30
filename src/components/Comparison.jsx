function Comparison({
  first,
  second,
  onOpen,
  onSwap,
}) {
  const statRows = [
    ["PAC", "pace"],
    ["SHO", "shooting"],
    ["PAS", "passing"],
    ["DRI", "dribbling"],
    ["DEF", "defending"],
    ["PHY", "physical"],
  ];

  const displayValue = (value, fallback = "Not listed") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }

    return value;
  };

  const formatDifference = (firstValue, secondValue) => {
    const left = Number(firstValue);
    const right = Number(secondValue);

    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      return "Not listed";
    }

    const difference = left - right;
    return `${difference >= 0 ? "+" : ""}${difference}`;
  };

  return (
    <div className="comparison-area">
      <div className="comparison-hero">
        <ComparisonPlayer player={first} onOpen={onOpen} />

        <div className="comparison-center">
          <button type="button" className="swap-button" onClick={onSwap}>
            ⇄ SWAP
          </button>
        </div>

        <ComparisonPlayer player={second} onOpen={onOpen} />
      </div>

      <div className="comparison-summary">
        <SummaryCard label="OVERALL" firstValue={displayValue(first.overall)} secondValue={displayValue(second.overall)} />
        <SummaryCard label="META SCORE" firstValue={displayValue(first.metaScore)} secondValue={displayValue(second.metaScore)} />
        <SummaryCard label="POSITION" firstValue={displayValue(first.position)} secondValue={displayValue(second.position)} />
        <SummaryCard label="CLUB" firstValue={displayValue(first.club)} secondValue={displayValue(second.club)} />
        <SummaryCard label="LEAGUE" firstValue={displayValue(first.league)} secondValue={displayValue(second.league)} />
        <SummaryCard label="NATION" firstValue={displayValue(first.nation)} secondValue={displayValue(second.nation)} />
      </div>

      <div className="comparison-meta-section">
        <div className="comparison-meta-card">
          <span>PLAYER 1 META SCORE</span>
          <strong>{displayValue(first.metaScore)} <small>/ 100</small></strong>
          <em>{displayValue(first.tier)} TIER</em>
        </div>

        <div className="comparison-meta-card">
          <span>PLAYER 2 META SCORE</span>
          <strong>{displayValue(second.metaScore)} <small>/ 100</small></strong>
          <em>{displayValue(second.tier)} TIER</em>
        </div>
      </div>

      <div className="comparison-stat-panel">
        {statRows.map(([label, key]) => {
          const left = displayValue(first[key], "Not listed");
          const right = displayValue(second[key], "Not listed");
          const difference = formatDifference(first[key], second[key]);

          return (
            <div className="comparison-stat-row" key={label}>
              <div className="comparison-stat-player comparison-stat-player-left">
                <strong>{left}</strong>
                <span>{label}</span>
              </div>

              <div className="comparison-stat-center">
                <span className="comparison-stat-diff">{difference}</span>
              </div>

              <div className="comparison-stat-player comparison-stat-player-right">
                <strong>{right}</strong>
                <span>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  firstValue,
  secondValue,
}) {
  return (
    <div className="summary-card">
      <span>{label}</span>

      <div className="summary-values">
        <strong>{firstValue}</strong>
        <span>VS</span>
        <strong>{secondValue}</strong>
      </div>
    </div>
  );
}

function ComparisonPlayer({
  player,
  onOpen,
}) {
  if (!player) {
    return null;
  }

  return (
    <button type="button" className="comparison-player" onClick={() => onOpen(player)}>
      <div className="comparison-player-image">
        {player.image ? (
          <img src={player.image} alt={player.name} />
        ) : (
          <span>{player.name?.charAt(0) || "?"}</span>
        )}
      </div>

      <div className="comparison-player-info">
        <strong>{player.name}</strong>
        <span>{player.position} • OVR {player.overall}</span>
        <small>{player.club}</small>
        <small>{player.nation}</small>
        <small>META {player.metaScore} • {player.tier} TIER</small>
      </div>
    </button>
  );
}

export default Comparison;
