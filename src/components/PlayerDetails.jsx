import { useState } from "react";
import PlayerCard from "./PlayerCard";
import PlayerSharePanel from "./PlayerSharePanel";
import MetaBreakdown from "./MetaBreakdown";
import ProfileStat from "./ProfileStat";
import ProfileInfo from "./ProfileInfo";

function formatValue(value, suffix = "") {
  if (Array.isArray(value)) return value.length ? `${value.join(", ")}${suffix}` : "Not listed";
  if (value === null || value === undefined || value === "") return "Not listed";
  return `${value}${suffix}`;
}

function toPlayStyles(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return typeof value === "string" && value.trim() ? [value] : [];
}

function getBaseAttributes(player) {
  return player.position === "GK"
    ? [["DIV", player.pace], ["HAN", player.shooting], ["KIC", player.passing], ["REF", player.dribbling], ["SPD", player.defending], ["POS", player.physical]]
    : [["PAC", player.pace], ["SHO", player.shooting], ["PAS", player.passing], ["DRI", player.dribbling], ["DEF", player.defending], ["PHY", player.physical]];
}

function PlayerDetails({ player, backLabel = "PLAYERS", onBack, onCompare }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const baseAttributes = getBaseAttributes(player);
  const playStyles = toPlayStyles(player.playStyles || player.playstyles);
  const playStylesPlus = toPlayStyles(player.playStylesPlus || player.playstylesPlus || player.playStylePlus);
  const workRate = [player.attackingWorkRate, player.defensiveWorkRate].filter(Boolean).join(" / ");

  return (
    <>
    <main className="player-details-page">
      <div className="player-details-topbar">
        <button
          type="button"
          className="clear-button"
          onClick={onBack}
        >
          ← BACK TO {backLabel}
        </button>

        <div className="player-details-label">
          PLAYER PROFILE / FC27 ULTIMATE TEAM
        </div>
      </div>

      <header className="profile-summary-panel">
        <div className="profile-summary-portrait" aria-hidden={!player.image || portraitFailed}>
          {player.image && !portraitFailed ? (
            <img
              src={player.image}
              alt={`${player.name} player image`}
              decoding="async"
              onError={() => setPortraitFailed(true)}
            />
          ) : (
            <span>{player.name?.charAt(0) || "?"}</span>
          )}
        </div>
        <div className="profile-summary-copy">
          <div className="profile-kicker">PLAYER DOSSIER</div>
          <h1>{player.name}</h1>
          <div className="profile-meta-line">
            <span className="profile-position-badge">{player.position}</span>
            <span>{player.club}</span>
            <span>{player.league}</span>
            <span>{player.nation}</span>
          </div>
        </div>
        <div className="profile-score-lockup" data-meta-tier={player.tier}>
          <span>META SCORE</span>
          <strong>{player.metaScore}<small>/100</small></strong>
          <b>{player.tier} TIER</b>
        </div>
        <div className="profile-summary-footer">
          <span>OVERALL <strong>{player.overall}</strong></span>
          <span>POSITION <strong>{player.position}</strong></span>
          <div className="profile-action-buttons">
            <button type="button" className="profile-share-button" onClick={() => setShareOpen(true)}>
              <span aria-hidden="true">↗</span> SHARE PLAYER
            </button>
            <button type="button" className="profile-compare-button" onClick={() => onCompare(player)}>
              ADD TO COMPARE
            </button>
          </div>
        </div>
      </header>

      <div className="player-profile-layout">
        <aside className="player-details-card-column" aria-label={`${player.name} player card`}>
          <PlayerCard player={player} onOpen={() => {}} onCompare={onCompare} />
        </aside>

        <div className="player-profile-main">
          <section className="profile-content-section" aria-labelledby="profile-stats-title">
            <div className="profile-section-heading">
              <span>01</span>
              <div><small>PLAYER ATTRIBUTES</small><h2 id="profile-stats-title">BASE STATS</h2></div>
            </div>
            <div className="profile-stats-panel">
              {baseAttributes.map(([label, value]) => (
                <ProfileStat key={label} label={label} value={value} />
              ))}
            </div>
          </section>

          <section className="profile-content-section profile-analysis-section" aria-labelledby="profile-analysis-title">
            <div className="profile-section-heading">
              <span>02</span>
              <div><small>POSITION-AWARE RATING</small><h2 id="profile-analysis-title">META PROFILE</h2></div>
            </div>
            <div className="profile-analysis-score">
              <div><span>OVERALL META SCORE</span><strong>{player.metaScore}<small>/100</small></strong></div>
              <span className="profile-analysis-tier">{player.tier} TIER</span>
            </div>
            <MetaBreakdown player={player} />
          </section>

          <section className="profile-content-section" aria-labelledby="profile-details-title">
            <div className="profile-section-heading">
              <span>03</span>
              <div><small>PLAYER INFORMATION</small><h2 id="profile-details-title">DETAILS</h2></div>
            </div>
            <div className="profile-info-grid">
              <ProfileInfo label="PREFERRED FOOT" value={formatValue(player.preferredFoot)} />
              <ProfileInfo label="WEAK FOOT" value={formatValue(player.weakFoot, "★")} />
              <ProfileInfo label="SKILL MOVES" value={formatValue(player.skillMoves, "★")} />
              <ProfileInfo label="WORK RATE" value={workRate || "Not listed"} />
              <ProfileInfo label="HEIGHT" value={formatValue(player.height, " cm")} />
              <ProfileInfo label="BODY TYPE" value={formatValue(player.bodyType)} />
              <ProfileInfo label="ALTERNATE POSITIONS" value={formatValue(player.alternatePositions)} />
              <ProfileInfo label="CLUB" value={formatValue(player.club)} />
              <ProfileInfo label="LEAGUE" value={formatValue(player.league)} />
              <ProfileInfo label="NATION" value={formatValue(player.nation)} />
            </div>
          </section>

          {playStyles.length || playStylesPlus.length ? (
            <section className="profile-content-section" aria-labelledby="profile-playstyles-title">
              <div className="profile-section-heading">
                <span>04</span>
                <div><small>IN-GAME TRAITS</small><h2 id="profile-playstyles-title">PLAYSTYLES</h2></div>
              </div>
              <div className="profile-playstyles-grid">
                {playStyles.length ? <div className="profile-playstyle-group"><h3>PLAYSTYLES</h3><div>{playStyles.map((style) => <span key={style}>{style}</span>)}</div></div> : null}
                {playStylesPlus.length ? <div className="profile-playstyle-group is-plus"><h3>PLAYSTYLES+</h3><div>{playStylesPlus.map((style) => <span key={style}>{style}</span>)}</div></div> : null}
              </div>
            </section>
          ) : null}

          <section className="profile-content-section" aria-labelledby="profile-card-info-title">
            <div className="profile-section-heading">
              <span>{playStyles.length || playStylesPlus.length ? "05" : "04"}</span>
              <div><small>ITEM RECORD</small><h2 id="profile-card-info-title">CARD INFORMATION</h2></div>
            </div>
            <div className="profile-info-grid profile-card-info-grid">
              <ProfileInfo label="CARD TYPE" value={formatValue(player.cardType || player.promoName)} />
              <ProfileInfo label="PROMO NAME" value={formatValue(player.promoName || player.promo)} />
              {player.dataVerified !== undefined ? <ProfileInfo label="DATA VERIFIED" value={player.dataVerified ? "Verified" : "Unverified"} /> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
    {shareOpen ? <PlayerSharePanel player={player} onClose={() => setShareOpen(false)} /> : null}
    </>
  );
}

export default PlayerDetails;
