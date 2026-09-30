import { useMemo } from "react";
import { getPositionWeights, getTier, getTierInfo } from "../lib/meta/metaScore";
import PlayerCard from "./PlayerCard";

const POSITION_CODES = ["ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM", "LB", "LWB", "RB", "RWB", "CB", "GK"];
const ATTRIBUTE_KEYS = {
  Pace: "pace",
  Shooting: "shooting",
  Passing: "passing",
  Dribbling: "dribbling",
  Defending: "defending",
  Physical: "physical",
  Diving: "pace",
  Handling: "shooting",
  Kicking: "passing",
  Reflexes: "dribbling",
  Positioning: "physical",
};
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
    .map(({ minScore, ...tier }) => tier);
}

function buildPositionGroups() {
  const groupsByWeights = new Map();
  POSITION_CODES.forEach((position) => {
    const weights = getPositionWeights({ position });
    const signature = JSON.stringify(weights);
    const group = groupsByWeights.get(signature) || { positions: [], weights };
    group.positions.push(position);
    groupsByWeights.set(signature, group);
  });

  const groups = [...groupsByWeights.values()].map((group) => ({
    ...group,
    label: group.positions.join(" / "),
    isGoalkeeper: group.positions.includes("GK"),
  }));
  groups.push({ label: "OTHER POSITIONS / FALLBACK", positions: [], weights: getPositionWeights({}), isGoalkeeper: false });
  return groups;
}

function getExampleAttributes(player, weights) {
  return Object.entries(weights).map(([attribute, weight]) => ({
    attribute,
    label: ATTRIBUTE_LABELS[attribute] || attribute,
    value: player[ATTRIBUTE_KEYS[attribute]],
    weight,
  }));
}

function MetaScorePage({ players, onNavigate, onOpen, onCompare }) {
  const rankedPlayers = useMemo(() => [...players].sort((left, right) => {
    const scoreDifference = Number(right.metaScore || 0) - Number(left.metaScore || 0);
    if (scoreDifference) return scoreDifference;
    const overallDifference = Number(right.overall || 0) - Number(left.overall || 0);
    return overallDifference || String(left.name || "").localeCompare(String(right.name || ""));
  }), [players]);
  const positionGroups = useMemo(buildPositionGroups, []);
  const tierRanges = useMemo(buildTierRanges, []);
  const examplePlayer = rankedPlayers[0] || null;
  const exampleWeights = examplePlayer ? getPositionWeights(examplePlayer) : {};
  const exampleAttributes = examplePlayer ? getExampleAttributes(examplePlayer, exampleWeights) : [];
  const goalkeeperWeights = positionGroups.find((group) => group.isGoalkeeper)?.weights || {};
  const outfieldGroups = positionGroups.filter((group) => !group.isGoalkeeper);

  return (
    <main className="meta-explainer-page">
      <header className="meta-explainer-hero">
        <div className="meta-explainer-pitch" aria-hidden="true" />
        <div className="meta-explainer-hero-copy">
          <span className="meta-explainer-kicker">FC27 ULTIMATE TEAM / RATING MODEL</span>
          <h1>FC27 META <span>SCORE</span></h1>
          <h2>How is your FC27 player rated?</h2>
          <p>Every player receives a META Score from 0–100 based on the attributes that matter most for their position.</p>
          <div className="meta-explainer-badges"><span>POSITION-WEIGHTED SYSTEM</span><span>0–100 SCORE</span><span>WEBSITE MODEL · NOT OFFICIAL EA</span></div>
        </div>
        <div className="meta-hero-mark" aria-hidden="true">M</div>
      </header>

      <section className="meta-explainer-intro">
        <div className="meta-section-index">01 / THE MODEL</div>
        <div className="meta-intro-copy">
          <span className="meta-section-kicker">A POSITION-FIRST VIEW</span>
          <h2>WHAT IS META SCORE?</h2>
          <p>META Score combines relevant player attributes using weights that change by position. Attackers, midfielders, defenders, and goalkeepers are assessed with different priorities.</p>
          <p><strong>Higher score means a stronger fit for this website's position-specific META model.</strong> It is not the same as Overall Rating: a player's role-relevant attributes can produce a strong META Score even when their Overall is lower, and a high Overall alone does not guarantee a high META Score.</p>
        </div>
        <aside className="meta-model-note"><span>IMPORTANT CONTEXT</span><strong>A model, not an official EA rating.</strong><p>The score is a comparison aid based on this site's published approach, not a universal measure of player quality.</p></aside>
      </section>

      <section className="meta-weights-section">
        <header className="meta-section-heading">
          <div><span className="meta-section-kicker">POSITION-SPECIFIC ATTRIBUTE MIX</span><h2>HOW THE SCORE IS CALCULATED</h2></div>
          <p>These weights come directly from the existing scoring utility. The final score also applies the adjustments described below.</p>
        </header>
        <div className="meta-position-grid">
          {outfieldGroups.map((group) => (
            <article className="meta-position-card" key={group.label}>
              <header><span>OUTFIELD MODEL</span><h3>{group.label}</h3></header>
              <dl>{Object.entries(group.weights).map(([attribute, weight]) => <div className="meta-weight-row" key={attribute}><dt>{ATTRIBUTE_LABELS[attribute] || attribute}</dt><dd><span>{attribute}</span><strong>{Math.round(weight * 100)}%</strong></dd><i><b style={{ width: `${weight * 100}%` }} /></i></div>)}</dl>
            </article>
          ))}
        </div>
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
          <header className="meta-section-heading"><div><span className="meta-section-kicker">CURRENT DATABASE LEADER</span><h2>SEE IT IN ACTION</h2></div><p>This example is selected dynamically from the current scored player collection.</p></header>
          <div className="meta-example-panel">
            <div className="meta-example-card"><PlayerCard player={examplePlayer} onOpen={onOpen} onCompare={onCompare} showCompareButton={false} /></div>
            <div className="meta-example-details">
              <span className="meta-example-rank">#1 META SCORE</span>
              <h3>{examplePlayer.name || "Not listed"}</h3>
              <p>{examplePlayer.position || "Not listed"} <i /> OVR {examplePlayer.overall ?? "Not listed"} <i /> META {examplePlayer.metaScore ?? "Not listed"} / 100 <i /> {examplePlayer.tier || "Not listed"} TIER</p>
              <div className="meta-example-weights"><h4>RELEVANT ATTRIBUTES & POSITION WEIGHTS</h4><div>{exampleAttributes.map(({ attribute, label, value, weight }) => <div className="meta-example-stat" key={attribute}><span>{label}</span><strong>{value ?? "Not listed"}</strong><small>{Math.round(weight * 100)}% weight</small></div>)}</div></div>
              <button type="button" className="secondary-action" onClick={() => onOpen(examplePlayer)}>OPEN PLAYER DETAILS <span aria-hidden="true">→</span></button>
              <small className="meta-example-caveat">Attribute weights are shown from the existing utility. Intermediate score contributions are not exposed by the scoring engine.</small>
            </div>
          </div>
        </section>
      ) : (
        <section className="meta-example-empty"><strong>DATABASE EMPTY</strong><p>No player data is currently available.</p></section>
      )}

      <section className="meta-vs-section">
        <header className="meta-section-heading"><div><span className="meta-section-kicker">TWO DIFFERENT NUMBERS</span><h2>META SCORE ≠ OVERALL</h2></div></header>
        <div className="meta-vs-grid">
          <article><span>OVERALL</span><h3>The game's player rating</h3><p>Overall is the rating supplied with the player record. In this model, it has a small anchoring role in the final META Score when available.</p></article>
          <div className="meta-vs-mark" aria-hidden="true">≠</div>
          <article><span>META SCORE</span><h3>This website's position-weighted model</h3><p>META Score emphasizes the attributes and limited gameplay/context adjustments selected for the player's position. That is why it can differ from Overall.</p></article>
        </div>
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
    </main>
  );
}

export default MetaScorePage;