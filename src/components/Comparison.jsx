import { useState } from "react";

const ATTRIBUTE_ROWS = [
  ["PAC", "pace"],
  ["SHO", "shooting"],
  ["PAS", "passing"],
  ["DRI", "dribbling"],
  ["DEF", "defending"],
  ["PHY", "physical"],
];

function numericValue(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatDifference(firstValue, secondValue) {
  const difference = firstValue - secondValue;
  return `${difference > 0 ? "+" : ""}${difference}`;
}

function Comparison({ first, second, onOpen, onSwap }) {
  const availableAttributes = ATTRIBUTE_ROWS.filter(([, key]) =>
    numericValue(first[key]) !== null && numericValue(second[key]) !== null
  );
  const metaDifference = numericValue(first.metaScore) - numericValue(second.metaScore);

  return (
    <section className="comparison-area" aria-label="Player comparison">
      <div className="comparison-hero">
        <ComparisonPlayer key={first.id} player={first} label="PLAYER A" onOpen={onOpen} />

        <div className="comparison-center">
          <span className="comparison-versus" aria-hidden="true">VS</span>
          <button type="button" className="swap-button" onClick={onSwap} aria-label="Swap Player A and Player B">
            <span aria-hidden="true">⇄</span> SWAP PLAYERS
          </button>
        </div>

        <ComparisonPlayer key={second.id} player={second} label="PLAYER B" onOpen={onOpen} />
      </div>

      <section className="comparison-meta-feature" aria-labelledby="comparison-meta-heading">
        <div className="comparison-panel-heading">
          <span className="section-label">THE DECIDING METRIC</span>
          <h3 id="comparison-meta-heading">META SCORE FACE-OFF</h3>
        </div>
        <div className="comparison-meta-duel">
          <MetaScoreCard player={first} label="PLAYER A META" />
          <div className="comparison-meta-versus">
            <span>VS</span>
            <strong>{metaDifference > 0 ? `A +${metaDifference}` : metaDifference < 0 ? `B +${Math.abs(metaDifference)}` : "TIED"}</strong>
          </div>
          <MetaScoreCard player={second} label="PLAYER B META" />
        </div>
      </section>

      <section className="comparison-attributes" aria-labelledby="comparison-attributes-heading">
        <div className="comparison-panel-heading comparison-attributes-heading">
          <div>
            <span className="section-label">ATTRIBUTE BREAKDOWN</span>
            <h3 id="comparison-attributes-heading">HEAD-TO-HEAD STATS</h3>
          </div>
          <div className="comparison-legend"><i /> PLAYER A <i /> PLAYER B</div>
        </div>

        {availableAttributes.length > 0 ? (
          <div className="comparison-stat-panel">
            {availableAttributes.map(([label, key]) => {
              const firstValue = numericValue(first[key]);
              const secondValue = numericValue(second[key]);
              const difference = firstValue - secondValue;
              return (
                <div className="comparison-stat-row" key={label}>
                  <AttributeValue
                    value={firstValue}
                    label={`${first.name} ${label}`}
                    side="left"
                    isWinner={difference > 0}
                  />
                  <div className="comparison-stat-center">
                    <span className="comparison-stat-name">{label}</span>
                    <span className={`comparison-stat-diff${difference === 0 ? " is-tied" : ""}`}>
                      {formatDifference(firstValue, secondValue)}
                    </span>
                  </div>
                  <AttributeValue
                    value={secondValue}
                    label={`${second.name} ${label}`}
                    side="right"
                    isWinner={difference < 0}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="comparison-no-attributes">No shared numeric attributes are available for these players.</p>
        )}
      </section>

      <section className="comparison-summary-section" aria-labelledby="comparison-details-heading">
        <div className="comparison-panel-heading">
          <span className="section-label">PLAYER DETAILS</span>
          <h3 id="comparison-details-heading">AT A GLANCE</h3>
        </div>
        <div className="comparison-summary">
          <SummaryCard label="OVERALL" firstValue={first.overall} secondValue={second.overall} />
          <SummaryCard label="POSITION" firstValue={first.position} secondValue={second.position} />
          <SummaryCard label="CLUB" firstValue={first.club} secondValue={second.club} />
          <SummaryCard label="LEAGUE" firstValue={first.league} secondValue={second.league} />
          <SummaryCard label="NATION" firstValue={first.nation} secondValue={second.nation} />
        </div>
      </section>
    </section>
  );
}

function MetaScoreCard({ player, label }) {
  return (
    <div className="comparison-meta-card">
      <span>{label}</span>
      <strong>{player.metaScore} <small>/ 100</small></strong>
      <em>{player.tier} TIER</em>
    </div>
  );
}

function AttributeValue({ value, label, side, isWinner }) {
  return (
    <div className={`comparison-stat-player comparison-stat-player-${side}${isWinner ? " is-winner" : ""}`}>
      {side === "left" ? <strong>{value}</strong> : null}
      <div className="comparison-stat-track" role="img" aria-label={`${label}: ${value} out of 100`}>
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {side === "right" ? <strong>{value}</strong> : null}
    </div>
  );
}

function SummaryCard({ label, firstValue, secondValue }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <div className="summary-values">
        <strong>{firstValue ?? "—"}</strong>
        <span>VS</span>
        <strong>{secondValue ?? "—"}</strong>
      </div>
    </div>
  );
}

function ComparisonPlayer({ player, label, onOpen }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="comparison-player">
      <div className="comparison-player-image">
        {player.image && !imageFailed ? (
          <img src={player.image} alt={player.name} onError={() => setImageFailed(true)} />
        ) : (
          <span aria-label={`${player.name} image unavailable`}>{player.name?.charAt(0) || "?"}</span>
        )}
      </div>
      <div className="comparison-player-info">
        <span className="comparison-player-label">{label}</span>
        <strong>{player.name}</strong>
        <span className="comparison-player-overall">{player.position} <i>•</i> OVR {player.overall}</span>
        <small>{player.club}</small>
        <div className="comparison-player-meta">
          <span>META SCORE</span>
          <strong>{player.metaScore}<small>/100</small></strong>
          <em>{player.tier} TIER</em>
        </div>
        <button type="button" className="comparison-profile-button" onClick={() => onOpen(player)}>
          VIEW PLAYER PROFILE
        </button>
      </div>
    </article>
  );
}

export default Comparison;
