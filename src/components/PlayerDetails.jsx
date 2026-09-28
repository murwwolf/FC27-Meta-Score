import MetaBreakdown from "./MetaBreakdown";
import ProfileStat from "./ProfileStat";
import ProfileInfo from "./ProfileInfo";

function PlayerDetails({
  player,
  onBack,
  onCompare,
}) {
  const isGK = player.position === "GK";

  const attributes = isGK
    ? [
        ["DIV", player.pace],
        ["HAN", player.shooting],
        ["KICK", player.passing],
        ["REF", player.dribbling],
        ["SPD", player.defending],
        ["POS", player.physical],
      ]
    : [
        ["PAC", player.pace],
        ["SHO", player.shooting],
        ["PAS", player.passing],
        ["DRI", player.dribbling],
        ["DEF", player.defending],
        ["PHY", player.physical],
      ];

  return (
    <main className="player-details-page">
      <div className="player-details-topbar">
        <button
          type="button"
          className="clear-button"
          onClick={onBack}
        >
          ← BACK TO PLAYERS
        </button>

        <div className="player-details-label">
          FC27 PLAYER PROFILE
        </div>
      </div>

      <section className="player-profile-hero">
        <div className="profile-background-glow" />

        <div className="profile-player-image">
          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
            />
          ) : (
            <div className="profile-image-placeholder">
              {player.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div className="profile-main-info">
          <div className="profile-kicker">
            {player.position} • FC27
          </div>

          <h1>{player.name}</h1>

          <div className="profile-meta-line">
            <span>{player.nation}</span>
            <span>•</span>
            <span>{player.league}</span>
            <span>•</span>
            <span>{player.club}</span>
          </div>

          <div className="profile-rating-row">
            <div className="profile-rating">
              <small>OVR</small>
              <strong>{player.overall}</strong>
            </div>

            <div className="profile-tier">
              <small>META TIER</small>
              <strong>{player.tier}</strong>
            </div>
          </div>

          <button
            type="button"
            className="profile-compare-button"
            onClick={() => onCompare(player)}
          >
            ⚔ ADD TO COMPARE
          </button>
        </div>

        <div className="profile-meta-card">
          <div className="profile-meta-label">
            META SCORE
          </div>

          <div className="profile-meta-number">
            {player.metaScore}
          </div>

          <div className="profile-meta-tier">
            {player.tier} TIER
          </div>

          <div className="profile-meta-line-small">
            FC27 META RATING
          </div>
        </div>
      </section>

      <section className="player-profile-content">
        <div className="profile-section-heading">
          <span>01</span>

          <div>
            <small>META ANALYSIS</small>
            <h2>SCORE BREAKDOWN</h2>
          </div>
        </div>

        <MetaBreakdown player={player} />

        <div className="profile-section-heading">
          <span>02</span>

          <div>
            <small>PLAYER ATTRIBUTES</small>
            <h2>BASE STATS</h2>
          </div>
        </div>

        <div className="profile-stats-panel">
          {attributes.map(([label, value]) => (
            <ProfileStat
              key={label}
              label={label}
              value={value}
            />
          ))}
        </div>

        <div className="profile-section-heading">
          <span>03</span>

          <div>
            <small>PLAYER INFORMATION</small>
            <h2>DETAILS</h2>
          </div>
        </div>

        <div className="profile-info-grid">
          <ProfileInfo
            label="POSITION"
            value={player.position}
          />

          <ProfileInfo
            label="ALTERNATE POSITIONS"
            value={player.alternatePositions || "N/A"}
          />

          <ProfileInfo
            label="PREFERRED FOOT"
            value={player.preferredFoot || "N/A"}
          />

          <ProfileInfo
            label="SKILL MOVES"
            value={`${player.skillMoves || 0}★`}
          />

          <ProfileInfo
            label="WEAK FOOT"
            value={`${player.weakFoot || 0}★`}
          />

          <ProfileInfo
            label="HEIGHT"
            value={`${player.height || 0} cm`}
          />

          <ProfileInfo
            label="WEIGHT"
            value={`${player.weight || 0} kg`}
          />

          <ProfileInfo
            label="ATTACKING WORK RATE"
            value={player.attackingWorkRate || "N/A"}
          />

          <ProfileInfo
            label="DEFENSIVE WORK RATE"
            value={player.defensiveWorkRate || "N/A"}
          />
        </div>

        <div className="profile-section-heading">
          <span>04</span>

          <div>
            <small>CLUB & COUNTRY</small>
            <h2>IDENTITY</h2>
          </div>
        </div>

        <div className="profile-identity-grid">
          <div className="identity-card">
            <span>NATION</span>
            <strong>{player.nation}</strong>
          </div>

          <div className="identity-card">
            <span>CLUB</span>
            <strong>{player.club}</strong>
          </div>

          <div className="identity-card">
            <span>LEAGUE</span>
            <strong>{player.league}</strong>
          </div>

          <div className="identity-card">
            <span>OVERALL RATING</span>
            <strong>{player.overall}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PlayerDetails;
