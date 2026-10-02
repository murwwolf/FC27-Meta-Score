import { useMemo, useState } from "react";
import { getPositionWeights, getTier, getTierInfo } from "../lib/meta/metaScore";
import MetaBreakdown from "./MetaBreakdown";
import PlayerCard from "./PlayerCard";

const POSITION_ORDER = ["ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM", "LB", "LWB", "RB", "RWB", "CB", "GK"];
const ATTRIBUTE_LABELS = {
  Pace: "PAC",
  Shooting: "SHO",
  Passing: "PAS",
  Dribbling: "DRI",
  Defending: "DEF",
  Physical: "PHY",
  Diving: "DIV",
  Handling: "HAN",
  Kicking: "KIC",
  Reflexes: "REF",
  Positioning: "POS",
};
const ATTRIBUTE_DESCRIPTIONS = {
  Pace: "Pace contributes according to the player's position group; it is especially weighted for wide attackers and fullbacks.",
  Shooting: "Shooting is weighted most for ST and CF, with smaller contributions in wide, midfield, defensive, and goalkeeper models.",
  Passing: "Passing has a strong role for attacking and central midfielders, with a smaller contribution in other outfield roles.",
  Dribbling: "Dribbling contributes to the site's ball-carrying model, particularly for wide attackers, CAMs, and central midfielders.",
  Defending: "Defending receives the largest weight for CBs, CDMs, and fullbacks; its importance varies by role.",
  Physical: "Physical contribution depends on position, with greater emphasis for centre-backs and defensive midfielders.",
};

function buildTierRanges() {
  const scoresByTier = new Map();
  for (let score = 0; score <= 100; score += 1) {
    const tier = getTier(score);
    const scores = scoresByTier.get(tier) || [];
    scores.push(score);
    scoresByTier.set(tier, scores);
  }

  return [...scoresByTier.entries()]
    .map(([tier, scores]) => ({
      tier,
      minScore: scores[0],
      range: scores[0] === 0 ? `Below ${scores[scores.length - 1] + 1}` : `${scores[0]}–${scores[scores.length - 1]}`,
      ...getTierInfo(scores[0]),
    }))
    .sort((left, right) => right.minScore - left.minScore)
    .map(({ tier, range, label, description }) => ({ tier, range, label, description }));
}

function buildPositionGroups(players) {
  const groupsByWeights = new Map();
  const positions = [...new Set(players.map((player) => String(player.position || "").trim().toUpperCase()).filter(Boolean))]
    .sort((left, right) => {
      const leftIndex = POSITION_ORDER.indexOf(left);
      const rightIndex = POSITION_ORDER.indexOf(right);
      return (leftIndex < 0 ? POSITION_ORDER.length : leftIndex) - (rightIndex < 0 ? POSITION_ORDER.length : rightIndex) || left.localeCompare(right);
    });
  positions.forEach((position) => {
    const weights = getPositionWeights({ position });
    const signature = JSON.stringify(weights);
    const group = groupsByWeights.get(signature) || { positions: [], weights, signature };
    group.positions.push(position);
    groupsByWeights.set(signature, group);
  });

  return [...groupsByWeights.values()].map((group) => ({
    ...group,
    label: group.positions.join(" / "),
    isGoalkeeper: group.positions.includes("GK"),
  }));
}

function MetaScorePage({ players, onNavigate, onOpen, onCompare }) {
  const [selectedProfile, setSelectedProfile] = useState("");
  const rankedPlayers = useMemo(() => [...players].sort((left, right) => {
    const scoreDifference = Number(right.metaScore || 0) - Number(left.metaScore || 0);
    if (scoreDifference) return scoreDifference;
    const overallDifference = Number(right.overall || 0) - Number(left.overall || 0);
    return overallDifference || String(left.name || "").localeCompare(String(right.name || ""));
  }), [players]);
  const positionGroups = useMemo(() => buildPositionGroups(players), [players]);
  const tierRanges = useMemo(() => buildTierRanges(), []);
  const examplePlayer = rankedPlayers[0] || null;
  const selectedPositionGroup = positionGroups.find((group) => group.signature === selectedProfile) || positionGroups[0];
  const goalkeeperWeights = positionGroups.find((group) => group.isGoalkeeper)?.weights || {};
  const sameOverallPair = useMemo(() => {
    const playersByOverall = new Map();
    players.forEach((player) => {
      const overall = Number(player.overall);
      if (!Number.isFinite(overall)) return;
      const group = playersByOverall.get(overall) || [];
      group.push(player);
      playersByOverall.set(overall, group);
    });
    let bestPair = null;
    let largestDifference = -1;
    playersByOverall.forEach((group) => {
      group.forEach((player, index) => {
        group.slice(index + 1).forEach((candidate) => {
          const difference = Math.abs(Number(player.metaScore) - Number(candidate.metaScore));
          if (difference > largestDifference) {
            largestDifference = difference;
            bestPair = [player, candidate];
          }
        });
      });
    });
    return bestPair;
  }, [players]);

  return (
    <main className="meta-explainer-page">
      <header className="meta-explainer-hero">
        <div className="meta-explainer-pitch" aria-hidden="true" />
        <div className="meta-explainer-hero-copy">
          <span className="meta-explainer-kicker">FC27 ULTIMATE TEAM / RATING MODEL</span>
          <h1>META <span>METHODOLOGY</span></h1>
          <h2>See exactly how FC27 META SCORE evaluates every player.</h2>
          <p>The META score is a position-aware rating designed to reflect which attributes matter most for a player's role. It is not simply the player's Overall rating.</p>
          <div className="meta-explainer-badges"><span>POSITION-WEIGHTED SYSTEM</span><span>0–100 SCORE</span><span>WEBSITE MODEL · NOT OFFICIAL EA</span></div>
        </div>
        <div className="meta-hero-mark" aria-hidden="true">M</div>
      </header>

      <section className="meta-explainer-intro">
        <div className="meta-section-index">01 / THE MODEL</div>
        <div className="meta-intro-copy">
          <span className="meta-section-kicker">A POSITION-FIRST VIEW</span>
          <h2>HOW META WORKS</h2>
          <p>Player attributes are weighted differently depending on position. The relevant weighted attributes are combined, then the model applies its existing gameplay and eligible height adjustments, a small Overall blend, and the engine's final rounding and clamp.</p>
          <p><strong>The same Overall can produce different META scores</strong> because the positions and underlying attributes differ. The score shown here is the existing scoring system used throughout the app.</p>
        </div>
        <aside className="meta-model-note"><span>IMPORTANT CONTEXT</span><strong>A model, not an official EA rating.</strong><p>The score is a comparison aid based on this site's published approach, not a universal measure of player quality.</p></aside>
      </section>

      <section className="meta-weights-section">
        <header className="meta-section-heading">
          <div><span className="meta-section-kicker">POSITION-SPECIFIC ATTRIBUTE MIX</span><h2>EXPLORE POSITION WEIGHTS</h2></div>
          <p>Choose a scoring profile to see its exact weighted attributes. Profiles are grouped only when the existing utility returns identical weights.</p>
        </header>
        <div className="meta-position-tabs" role="group" aria-label="Select a position scoring profile">
          {positionGroups.map((group) => (
            <button
              type="button"
              key={group.signature}
              aria-pressed={(selectedPositionGroup?.signature || "") === group.signature}
              onClick={() => setSelectedProfile(group.signature)}
            >
              {group.label}
            </button>
          ))}
        </div>
        {selectedPositionGroup ? (
          <article className="meta-position-card meta-selected-position" aria-live="polite">
            <header><span>{selectedPositionGroup.isGoalkeeper ? "GOALKEEPER MODEL" : "POSITION PROFILE"}</span><h3>{selectedPositionGroup.label}</h3></header>
            <dl>{Object.entries(selectedPositionGroup.weights).map(([attribute, weight]) => (
              <div className="meta-weight-row" key={attribute}>
                <dt>{ATTRIBUTE_LABELS[attribute] || attribute}</dt>
                <dd><span>{attribute}</span><strong>{Math.round(weight * 100)}%</strong></dd>
                <i aria-hidden="true"><b style={{ width: `${weight * 100}%` }} /></i>
              </div>
            ))}</dl>
          </article>
        ) : null}
        <div className="meta-final-formula">
          <span>FINAL SCORE FLOW</span>
          <p>Position-weighted base score + gameplay bonus + eligible height context bonus, then a small <strong>8% Overall anchor</strong>, rounded and clamped to 0–100.</p>
          <small>When Overall is available, the adjusted score is blended as 92% adjusted position score + 8% Overall.</small>
        </div>
        <div className="meta-modifier-grid">
          <article><span>GAMEPLAY BONUS</span><p>Skill Moves, Weak Foot, and high work rates contribute small bonuses. The effect is adjusted by position; goalkeepers receive no gameplay bonus.</p></article>
          <article><span>HEIGHT CONTEXT</span><p>Height can add a limited context adjustment for goalkeepers and centre-backs. Other positions do not receive this height adjustment.</p></article>
        </div>
      </section>

      <section className="meta-goalkeeper-section">
        <div className="meta-gk-heading"><span className="meta-section-kicker">A SEPARATE MODEL</span><h2>GOALKEEPER SCORING</h2><p>Goalkeeper attributes are mapped into the scoring engine's shared stat fields, then evaluated with goalkeeper-specific weights.</p></div>
        <div className="meta-gk-layout">
          <div className="meta-gk-map" aria-label="Goalkeeper stat mapping">
            {["PAC → DIV", "SHO → HAN", "PAS → KIC", "DRI → REF", "DEF → SPD", "PHY → POS"].map((mapping) => <span key={mapping}>{mapping}</span>)}
          </div>
          <div className="meta-gk-formula">
            <span>GOALKEEPER BASE WEIGHTS</span>
            <dl>{Object.entries(goalkeeperWeights).map(([attribute, weight]) => <div key={attribute}><dt>{attribute}</dt><dd>{Math.round(weight * 100)}%</dd></div>)}</dl>
            <p>Speed is not part of the weighted base. The implementation applies a separate SPD adjustment: +2 at 70+, +1 at 60–69, −1 at 40 or below, and no adjustment from 41–59.</p>
          </div>
        </div>
      </section>

      <section className="meta-role-explainer" aria-labelledby="meta-role-heading">
        <header className="meta-section-heading"><div><span className="meta-section-kicker">ROLE CHANGES PRIORITY</span><h2 id="meta-role-heading">WHY POSITION MATTERS</h2></div><p>The exact mix is determined by the selected player's position and the position weights above.</p></header>
        <div className="meta-role-grid">
          <article><span>ATTACK</span><p>ST/CF prioritize shooting; wide attackers prioritize dribbling and pace. Attacking roles also weight the gameplay bonus more.</p></article>
          <article><span>MIDFIELD</span><p>CAM, CM, and CDM use distinct profiles, balancing passing, dribbling, and role-specific shooting, defending, pace, and physical attributes.</p></article>
          <article><span>DEFENCE</span><p>Centre-backs emphasize defending and physical attributes; fullbacks use their own mix with pace, defending, passing, and dribbling.</p></article>
          <article><span>GOALKEEPER</span><p>GK uses Diving, Reflexes, Positioning, Handling, and Kicking weights, plus the engine's separate speed adjustment.</p></article>
        </div>
      </section>

      <section className="meta-attributes-section">
        <header className="meta-section-heading"><div><span className="meta-section-kicker">THE SIX SHARED STAT FIELDS</span><h2>ATTRIBUTE BREAKDOWN</h2></div><p>These attributes do not carry equal weight in every position model.</p></header>
        <div className="meta-attribute-grid">
          {Object.entries(ATTRIBUTE_DESCRIPTIONS).map(([attribute, description]) => <article className="meta-attribute-card" key={attribute}><span>{ATTRIBUTE_LABELS[attribute]}</span><h3>{attribute}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="meta-tiers-section">
        <header className="meta-section-heading"><div><span className="meta-section-kicker">WEBSITE CATEGORIES</span><h2>META TIERS</h2></div><p>Tier boundaries are determined by the existing <code>getTier</code> utility. These are website categories, not official EA tiers.</p></header>
        <div className="meta-tier-grid">
          {tierRanges.map(({ tier, range, label, description }) => <article className={`meta-tier-card tier-${tier.toLowerCase()}`} key={tier} data-tier={tier}><strong>{tier}</strong><span>{range}</span><h3>{label}</h3><p>{description}</p></article>)}
        </div>
      </section>

      {examplePlayer ? (
        <section className="meta-example-section">
          <header className="meta-section-heading"><div><span className="meta-section-kicker">REAL DATABASE RECORD</span><h2>EXAMPLE CALCULATION</h2></div><p>All values below come from this player record and the existing score utilities. This explains the current calculation; it is not a new scoring rule.</p></header>
          <div className="meta-example-panel has-meta-breakdown">
            <div className="meta-example-card"><PlayerCard player={examplePlayer} onOpen={onOpen} onCompare={onCompare} showCompareButton={false} /></div>
            <div className="meta-example-details">
              <span className="meta-example-rank">LIVE DATABASE EXAMPLE</span>
              <h3>{examplePlayer.name || "Not listed"}</h3>
              <p>{examplePlayer.position || "Not listed"} <i /> OVR {examplePlayer.overall ?? "Not listed"} <i /> META {examplePlayer.metaScore ?? "Not listed"} / 100 <i /> {examplePlayer.tier || "Not listed"} TIER</p>
              <button type="button" className="secondary-action" onClick={() => onOpen(examplePlayer)}>OPEN PLAYER DETAILS <span aria-hidden="true">→</span></button>
            </div>
            <div className="meta-example-breakdown"><MetaBreakdown player={examplePlayer} /></div>
          </div>
        </section>
      ) : (
        <section className="meta-example-empty"><strong>DATABASE EMPTY</strong><p>No player data is currently available.</p></section>
      )}

      <section className="meta-vs-section">
        <header className="meta-section-heading"><div><span className="meta-section-kicker">SAME OVERALL · DIFFERENT RECORDS</span><h2>WHY OVERALL ≠ META</h2></div><p>Overall is the general card rating. META focuses on the attributes that matter most for a player's position.</p></header>
        <div className="meta-vs-grid">
          {sameOverallPair ? sameOverallPair.map((player) => (
            <article className="meta-same-overall-player" key={player.id}>
              <div className="meta-same-overall-card"><PlayerCard player={player} onOpen={onOpen} onCompare={onCompare} showCompareButton={false} /></div>
              <div><span>{player.position} · {player.overall} OVERALL</span><h3>{player.name}</h3><strong className={`meta-same-overall-score tier-${String(player.tier || "").toLowerCase()}`}>{player.metaScore} META · {player.tier} TIER</strong></div>
            </article>
          )) : (
            <article className="meta-same-overall-empty"><span>LIVE DATABASE EXAMPLE</span><h3>Position-weighted ratings</h3><p>Each player's META score is calculated from the attributes and adjustments relevant to their position.</p></article>
          )}
        </div>
        <p className="meta-example-caveat">A real database example, selected dynamically. Both players have the same Overall, while their positions and existing META scores differ; this is an illustration, not a new scoring rule.</p>
      </section>

      <section className="meta-limitations-section">
        <div><span className="meta-section-kicker">READ THE MODEL IN CONTEXT</span><h2>WHAT THE SCORE DOESN'T TELL YOU</h2></div>
        <div className="meta-limitations-copy"><p>The model cannot fully capture animations, PlayStyles interactions, body type, in-game feel, formation and tactics, chemistry, or how a player fits your squad and personal preferences.</p><strong>META Score is a useful comparison tool, not a guarantee that one player will feel better for every player or every squad.</strong></div>
      </section>

      <section className="meta-explainer-cta">
        <span className="meta-section-kicker">BUILD YOUR OWN VIEW</span>
        <h2>READY TO FIND YOUR META PLAYERS?</h2>
        <div><button type="button" className="primary-action" onClick={() => onNavigate("players")}>EXPLORE PLAYERS <span aria-hidden="true">→</span></button><button type="button" className="secondary-action" onClick={() => onNavigate("rankings")}>VIEW RANKINGS <span aria-hidden="true">↗</span></button><button type="button" className="secondary-action" onClick={() => onNavigate("compare")}>COMPARE PLAYERS <span aria-hidden="true">⇄</span></button></div>
      </section>
      <p className="meta-methodology-disclaimer">META SCORE is an in-app calculation based on the FC27 player attributes available in this database. It is not an official EA rating.</p>
    </main>
  );
}

export default MetaScorePage;