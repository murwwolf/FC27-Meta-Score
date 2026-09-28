function MetaBreakdown({ player }) {
  const isGK = player.position === "GK";

  const rows = isGK
    ? [
        ["DIVING", player.pace, 0.2],
        ["HANDLING", player.shooting, 0.15],
        ["KICKING", player.passing, 0.15],
        ["REFLEXES", player.dribbling, 0.2],
        ["SPEED", player.defending, 0.1],
        ["POSITIONING", player.physical, 0.1],
        ["OVERALL", player.overall, 0.1],
      ]
    : [
        ["PACE", player.pace, 0.2],
        ["SHOOTING", player.shooting, 0.15],
        ["PASSING", player.passing, 0.15],
        ["DRIBBLING", player.dribbling, 0.2],
        ["DEFENDING", player.defending, 0.1],
        ["PHYSICAL", player.physical, 0.1],
        ["OVERALL", player.overall, 0.1],
      ];

  const skillBonus =
    Number(player.skillMoves) >= 5
      ? 3
      : Number(player.skillMoves) >= 4
        ? 2
        : 0;

  const weakFootBonus =
    Number(player.weakFoot) >= 5
      ? 2
      : Number(player.weakFoot) >= 4
        ? 1
        : 0;

  return (
    <div className="meta-breakdown">
      <div className="meta-breakdown-head">
        <div>
          <span className="meta-engine-label">
            FC27 META ENGINE
          </span>

          <h3>HOW THIS SCORE IS BUILT</h3>

          <p>
            Core attributes weighted by their importance
            to the META score.
          </p>
        </div>

        <div className="meta-engine-score">
          <small>META SCORE</small>

          <strong>{player.metaScore}</strong>

          <span>{player.tier} TIER</span>
        </div>
      </div>

      <div className="meta-breakdown-divider" />

      <div className="meta-breakdown-list">
        {rows.map(([label, value, weight]) => {
          const statValue = Math.min(
            Math.max(Number(value) || 0, 0),
            100
          );

          const contribution = Math.round(
            statValue * weight
          );

          return (
            <div
              className="meta-engine-row"
              key={label}
            >
              <div className="meta-engine-row-top">
                <div className="meta-engine-name">
                  <span>{label}</span>

                  <small>
                    {Math.round(weight * 100)}% WEIGHT
                  </small>
                </div>

                <div className="meta-engine-values">
                  <strong>{statValue}</strong>

                  <span>+{contribution}</span>
                </div>
              </div>

              <div className="meta-engine-track">
                <div
                  className="meta-engine-fill"
                  style={{
                    width: `${statValue}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="meta-bonus-section">
        <div className="meta-bonus-heading">
          <span>02</span>

          <div>
            <small>ADDITIONAL VALUE</small>

            <strong>META BONUSES</strong>
          </div>
        </div>

        <div className="meta-bonus-grid">
          <div className="meta-bonus-card">
            <div className="meta-bonus-icon">
              ★
            </div>

            <div className="meta-bonus-info">
              <span>SKILL MOVES</span>

              <small>
                {player.skillMoves || 0}★ SKILL MOVES
              </small>
            </div>

            <strong
              className={
                skillBonus > 0 ? "active" : ""
              }
            >
              +{skillBonus}
            </strong>
          </div>

          <div className="meta-bonus-card">
            <div className="meta-bonus-icon">
              ✦
            </div>

            <div className="meta-bonus-info">
              <span>WEAK FOOT</span>

              <small>
                {player.weakFoot || 0}★ WEAK FOOT
              </small>
            </div>

            <strong
              className={
                weakFootBonus > 0 ? "active" : ""
              }
            >
              +{weakFootBonus}
            </strong>
          </div>
        </div>
      </div>

      <div className="meta-engine-footer">
        <span>SCORING MODEL</span>

        <div />

        <strong>FC27 META SCORE / 100</strong>
      </div>
    </div>
  );
}

export default MetaBreakdown;
