function Comparison({
  first,
  second,
  onOpen,
  onSwap,
}) {
  const formatStyles = (player, keys) => {
    const styles = keys.map((key) => player[key]).find(Boolean);
    return Array.isArray(styles) ? styles.join(", ") || "Not listed" : styles || "Not listed";
  };
  const bothGoalkeepers =
    first.position === "GK" &&
    second.position === "GK";

  const statGroups = [
    {
      title: "CORE",
      stats: [
        ["OVR", "overall"],
        ["META SCORE", "metaScore"],
      ],
    },
    {
      title: bothGoalkeepers
        ? "GOALKEEPING"
        : "ATTACK",
      stats: bothGoalkeepers
        ? [
            ["DIV", "pace"],
            ["HAN", "shooting"],
            ["KICK", "passing"],
            ["REF", "dribbling"],
          ]
        : [
            ["PAC", "pace"],
            ["SHO", "shooting"],
            ["PAS", "passing"],
            ["DRI", "dribbling"],
          ],
    },
    {
      title: "DEFENCE & PHYSICAL",
      stats: bothGoalkeepers
        ? [
            ["SPD", "defending"],
            ["POS", "physical"],
          ]
        : [
            ["DEF", "defending"],
            ["PHY", "physical"],
          ],
    },
  ];

  return (
    <div className="comparison-area">
      <div className="comparison-hero">
        <ComparisonPlayer
          player={first}
          onOpen={onOpen}
        />

        <div className="comparison-center">
          <div className="comparison-center-vs">
            VS
          </div>

          <button
            type="button"
            className="reset-button"
            onClick={onSwap}
          >
            ↔ SWAP PLAYERS
          </button>
        </div>

        <ComparisonPlayer
          player={second}
          onOpen={onOpen}
        />
      </div>

      <div className="comparison-summary">
        <SummaryCard
          label="META SCORE"
          firstValue={first.metaScore}
          secondValue={second.metaScore}
        />

        <SummaryCard
          label="OVERALL"
          firstValue={first.overall}
          secondValue={second.overall}
        />

        <SummaryCard
          label="SKILL MOVES"
          firstValue={`${first.skillMoves || 0}★`}
          secondValue={`${second.skillMoves || 0}★`}
        />

        <SummaryCard
          label="WEAK FOOT"
          firstValue={`${first.weakFoot || 0}★`}
          secondValue={`${second.weakFoot || 0}★`}
        />
      </div>

      {statGroups.map((group) => (
        <div
          className="comparison-group"
          key={group.title}
        >
          <div className="comparison-group-title">
            {group.title}
          </div>

          {group.stats.map(([label, key]) => (
            <ComparisonStat
              key={key}
              label={label}
              firstValue={Number(first[key]) || 0}
              secondValue={Number(second[key]) || 0}
            />
          ))}
        </div>
      ))}

      <div className="comparison-extra">
        <ComparisonExtra label="POSITION" firstValue={first.position} secondValue={second.position} />
        <ComparisonExtra label="CLUB" firstValue={first.club || "N/A"} secondValue={second.club || "N/A"} />
        <ComparisonExtra label="LEAGUE" firstValue={first.league || "N/A"} secondValue={second.league || "N/A"} />
        <ComparisonExtra label="NATION" firstValue={first.nation || "N/A"} secondValue={second.nation || "N/A"} />
        <ComparisonExtra label="PLAYSTYLES" firstValue={formatStyles(first, ["playStyles", "playstyles"])} secondValue={formatStyles(second, ["playStyles", "playstyles"])} />
        <ComparisonExtra label="PLAYSTYLES+" firstValue={formatStyles(first, ["playStylesPlus", "playstylesPlus", "playStylePlus"])} secondValue={formatStyles(second, ["playStylesPlus", "playstylesPlus", "playStylePlus"])} />
        <ComparisonExtra
          label="PREFERRED FOOT"
          firstValue={first.preferredFoot || "N/A"}
          secondValue={second.preferredFoot || "N/A"}
        />

        <ComparisonExtra
          label="HEIGHT"
          firstValue={`${first.height || 0} cm`}
          secondValue={`${second.height || 0} cm`}
        />

        <ComparisonExtra
          label="WEIGHT"
          firstValue={`${first.weight || 0} kg`}
          secondValue={`${second.weight || 0} kg`}
        />

        <ComparisonExtra
          label="WORK RATE"
          firstValue={
            first.attackingWorkRate || "N/A"
          }
          secondValue={
            second.attackingWorkRate || "N/A"
          }
        />
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

function ComparisonStat({
  label,
  firstValue,
  secondValue,
}) {
  const difference = firstValue - secondValue;

  const firstWins = firstValue > secondValue;
  const secondWins = secondValue > firstValue;
  const tie = firstValue === secondValue;

  const firstWidth = Math.min(
    Math.max(firstValue, 0),
    100
  );

  const secondWidth = Math.min(
    Math.max(secondValue, 0),
    100
  );

  return (
    <div className="comparison-stat">
      <div className="comparison-stat-header">
        <span
          className={
            firstWins || tie
              ? "comparison-value winner"
              : "comparison-value"
          }
        >
          {firstValue}
        </span>

        <span className="comparison-stat-name">
          {label}
        </span>

        <span
          className={
            secondWins || tie
              ? "comparison-value winner"
              : "comparison-value"
          }
        >
          {secondValue}
        </span>
      </div>

      <div className="comparison-bars">
        <div className="comparison-bar left">
          <div
            className={
              firstWins
                ? "comparison-fill winner-fill"
                : "comparison-fill"
            }
            style={{
              width: `${firstWidth}%`,
            }}
          />
        </div>

        <div className="comparison-bar right">
          <div
            className={
              secondWins
                ? "comparison-fill winner-fill"
                : "comparison-fill"
            }
            style={{
              width: `${secondWidth}%`,
            }}
          />
        </div>
      </div>

      <div className="comparison-difference">
        {tie ? (
          <span>TIE</span>
        ) : firstWins ? (
          <span>
            PLAYER 1 +{difference}
          </span>
        ) : (
          <span>
            PLAYER 2 +{Math.abs(difference)}
          </span>
        )}
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
    <button
      type="button"
      className="comparison-player"
      onClick={() => onOpen(player)}
    >
      <div className="comparison-player-image">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
          />
        ) : (
          <span>
            {player.name?.charAt(0) || "?"}
          </span>
        )}
      </div>

      <div className="comparison-player-info">
        <strong>{player.name}</strong>

        <span>
          {player.position} • OVR {player.overall}
        </span>

        <small>
          {player.nation} • {player.club}
        </small>

        <small>
          META {player.metaScore} • {player.tier} TIER
        </small>
      </div>
    </button>
  );
}

function ComparisonExtra({
  label,
  firstValue,
  secondValue,
}) {
  const differs = String(firstValue) !== String(secondValue);

  return (
    <div className="comparison-extra-card">
      <span>{label}</span>

      <strong className={differs ? "comparison-extra-value different" : "comparison-extra-value"}>{firstValue}</strong>

      <span>VS</span>

      <strong className={differs ? "comparison-extra-value different" : "comparison-extra-value"}>{secondValue}</strong>
    </div>
  );
}

export default Comparison;
