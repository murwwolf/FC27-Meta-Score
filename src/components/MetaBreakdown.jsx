import { getContextBonus, getGameplayBonus, getPositionWeights, META_SCORE_CONFIG } from "../lib/meta/metaScore";

function MetaBreakdown({ player }) {
  const isGK = player.position === "GK";
  const statFields = {
    Pace: "pace", Shooting: "shooting", Passing: "passing",
    Dribbling: "dribbling", Defending: "defending", Physical: "physical",
    Diving: "pace", Handling: "shooting", Kicking: "passing",
    Reflexes: "dribbling", Positioning: "physical",
  };
  const rows = Object.entries(getPositionWeights(player)).map(([label, weight]) => [
    label, player[statFields[label]], weight,
  ]);
  const topAttribute = rows.reduce((highest, row) => row[2] > highest[2] ? row : highest);
  const gameplayBonus = getGameplayBonus(player);
  const contextBonus = getContextBonus(player);
  const speed = Number(player.defending) || 0;
  const goalkeeperSpeedAdjustment = speed >= 70 ? 2 : speed >= 60 ? 1 : speed <= 40 ? -1 : 0;
  const formatBonus = (value) => `${value > 0 ? "+" : ""}${Number(value.toFixed(1))}`;
  const hasOverall = Number.isFinite(Number(player.overall)) && Number(player.overall) > 0;
  const overallAnchor = hasOverall ? Number((Number(player.overall) * META_SCORE_CONFIG.overallShare).toFixed(1)) : 0;
  const adjustedScoreShare = Math.round(META_SCORE_CONFIG.adjustedScoreShare * 100);
  const overallShare = Math.round(META_SCORE_CONFIG.overallShare * 100);
  const attributeCodes = {
    Pace: "PAC", Shooting: "SHO", Passing: "PAS",
    Dribbling: "DRI", Defending: "DEF", Physical: "PHY",
    Diving: "DIV", Handling: "HAN", Kicking: "KIC",
    Reflexes: "REF", Positioning: "POS",
  };

  return (
    <div className="meta-breakdown">
      <div className="meta-breakdown-head">
        <div>
          <span className="meta-engine-label">POSITION-SPECIFIC FC27 ENGINE</span>
          <h3>HOW THIS SCORE IS BUILT</h3>
          <p>Each attribute is weighted for {player.position}. {topAttribute[0]} has the greatest influence at {Math.round(topAttribute[2] * 100)}%; gameplay and position context are then applied before the {adjustedScoreShare}% META / {overallShare}% OVR blend.</p>
        </div>
        <div className="meta-engine-score">
          <small>META SCORE</small>
          <strong>{player.metaScore}</strong>
          <span>{player.tier} TIER</span>
        </div>
      </div>

      <div className="meta-breakdown-divider" />
      <div className="meta-breakdown-legend">
        <span>ATTRIBUTE RATING</span>
        <span>WEIGHT IN POSITION SCORE</span>
        <span>WEIGHTED BASE POINTS</span>
      </div>
      <div className="meta-breakdown-list">
        {rows.map(([label, value, weight]) => {
          const statValue = Math.min(Math.max(Number(value) || 0, 0), 100);
          const contribution = (statValue * weight).toFixed(1);
          return (
            <div className="meta-engine-row" key={label}>
              <div className="meta-engine-row-top">
                <div className="meta-engine-name">
                  <span className="meta-engine-code">{attributeCodes[label]}</span>
                  <span>{label}</span>
                  <small>{Math.round(weight * 100)}% WEIGHT</small>
                </div>
                <div className="meta-engine-values"><strong>{statValue}</strong><span>+{contribution} BASE PTS</span></div>
              </div>
              <div className="meta-engine-track"><div className="meta-engine-fill" style={{ width: `${statValue}%` }} /></div>
            </div>
          );
        })}
      </div>

      <div className="meta-bonus-section">
        <div className="meta-bonus-heading"><span>02</span><div><small>ENGINE MODIFIERS</small><strong>FINAL SCORE ADJUSTMENTS</strong></div></div>
        <div className="meta-bonus-grid">
          <div className="meta-bonus-card"><div className="meta-bonus-info"><span>GAMEPLAY TRAITS</span><small>SKILL MOVES, WEAK FOOT & WORK RATES{isGK ? " · DISABLED FOR GK" : ""}</small></div><strong className={gameplayBonus > 0 ? "active" : ""}>{formatBonus(gameplayBonus)}</strong></div>
          <div className="meta-bonus-card"><div className="meta-bonus-info"><span>HEIGHT CONTEXT</span><small>{isGK ? "GOALKEEPER REACH" : player.position === "CB" ? "CENTRE-BACK SIZE" : "NOT USED FOR THIS POSITION"}</small></div><strong className={contextBonus > 0 ? "active" : ""}>{formatBonus(contextBonus)}</strong></div>
          <div className="meta-bonus-card"><div className="meta-bonus-info"><span>OVERALL ANCHOR</span><small>{hasOverall ? `${player.overall} OVR · ${overallShare}% OF FINAL BLEND` : "NOT APPLIED · OVERALL NOT LISTED"}</small></div><strong>{overallAnchor}</strong></div>
        </div>
        {isGK ? <p className="meta-gk-note">GK mapping: PAC = DIV · SHO = HAN · PAS = KIC · DRI = REF · DEF = SPD · PHY = POS. Speed adjustment: {formatBonus(goalkeeperSpeedAdjustment)}.</p> : null}
      </div>

      <div className="meta-engine-footer"><span>SCORING MODEL</span><div /><strong>FC27 META SCORE / 100 · FINAL CLAMP {META_SCORE_CONFIG.minimumScore}–{META_SCORE_CONFIG.maximumScore}</strong></div>
    </div>
  );
}

export default MetaBreakdown;
