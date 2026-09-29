import { getContextBonus, getGameplayBonus, getPositionWeights } from "../lib/meta/metaScore";

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
  const gameplayBonus = getGameplayBonus(player);
  const contextBonus = getContextBonus(player);
  const speed = Number(player.defending) || 0;
  const goalkeeperSpeedAdjustment = speed >= 70 ? 2 : speed >= 60 ? 1 : speed <= 40 ? -1 : 0;
  const formatBonus = (value) => `${value > 0 ? "+" : ""}${Number(value.toFixed(1))}`;

  return (
    <div className="meta-breakdown">
      <div className="meta-breakdown-head">
        <div>
          <span className="meta-engine-label">POSITION-SPECIFIC FC27 ENGINE</span>
          <h3>HOW THIS SCORE IS BUILT</h3>
          <p>Position weights are applied to core stats, followed by gameplay and context modifiers. The final score blends 92% of that result with 8% overall rating.</p>
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
          const statValue = Math.min(Math.max(Number(value) || 0, 0), 100);
          const contribution = (statValue * weight).toFixed(1);
          return (
            <div className="meta-engine-row" key={label}>
              <div className="meta-engine-row-top">
                <div className="meta-engine-name"><span>{label}</span><small>{Math.round(weight * 100)}% WEIGHT</small></div>
                <div className="meta-engine-values"><strong>{statValue}</strong><span>+{contribution}</span></div>
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
          <div className="meta-bonus-card"><div className="meta-bonus-info"><span>OVERALL ANCHOR</span><small>{player.overall} OVR · 8% OF FINAL BLEND</small></div><strong>{Number((Number(player.overall) * 0.08).toFixed(1))}</strong></div>
        </div>
        {isGK ? <p className="meta-gk-note">GK mapping: PAC = DIV · SHO = HAN · PAS = KIC · DRI = REF · DEF = SPD · PHY = POS. Speed adjustment: {formatBonus(goalkeeperSpeedAdjustment)}.</p> : null}
      </div>

      <div className="meta-engine-footer"><span>SCORING MODEL</span><div /><strong>FC27 META SCORE / 100 · FINAL CLAMP 0–100</strong></div>
    </div>
  );
}

export default MetaBreakdown;
