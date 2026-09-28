import Stat from "./Stat";

const countryCodes = {
  England: "GB",
  Scotland: "GB",
  Wales: "GB",
  "Northern Ireland": "GB",
  Brazil: "BR",
  Argentina: "AR",
  France: "FR",
  Spain: "ES",
  Portugal: "PT",
  Germany: "DE",
  Italy: "IT",
  Netherlands: "NL",
  Belgium: "BE",
  Croatia: "HR",
  Serbia: "RS",
  Norway: "NO",
  Sweden: "SE",
  Denmark: "DK",
  Poland: "PL",
  Ukraine: "UA",
  Austria: "AT",
  Switzerland: "CH",
  Turkey: "TR",
  Greece: "GR",
  Romania: "RO",
  Hungary: "HU",
  "Czech Republic": "CZ",
  Morocco: "MA",
  Algeria: "DZ",
  Egypt: "EG",
  Senegal: "SN",
  Ghana: "GH",
  Nigeria: "NG",
  Cameroon: "CM",
  Mali: "ML",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  Tunisia: "TN",
  "South Africa": "ZA",
  Colombia: "CO",
  Uruguay: "UY",
  Chile: "CL",
  Ecuador: "EC",
  Peru: "PE",
  Paraguay: "PY",
  Venezuela: "VE",
  USA: "US",
  Canada: "CA",
  Mexico: "MX",
  Japan: "JP",
  "South Korea": "KR",
  Korea: "KR",
  China: "CN",
  Australia: "AU",
  India: "IN",
  "Saudi Arabia": "SA",
  Qatar: "QA",
};

function getCountryCode(country) {
  return countryCodes[country] || "";
}

function PlayerCard({
  player,
  onOpen,
  onCompare,
}) {
  const isGK = player.position === "GK";
  const countryCode = getCountryCode(player.nation);

  return (
    <article
      className="player-card"
      onClick={() => onOpen(player)}
    >
      <div className="card-top">
        <div className="rating">
          <span>OVR</span>
          <strong>{player.overall}</strong>
        </div>

        <div className="player-name">
          {player.name}
        </div>

        <div className="position-badge">
          {player.position}
        </div>
      </div>

      <div className="player-image-area">
        <div className="image-glow" />

        {player.image ? (
          <img
            className="player-image"
            src={player.image}
            alt={player.name}
          />
        ) : (
          <div className="image-placeholder">
            {player.name.charAt(0)}
          </div>
        )}

        <div className="meta-score">
          <span>META</span>
          <strong>{player.metaScore}</strong>
          <small>{player.tier} TIER</small>
        </div>
      </div>

      <div className="player-info">
        <div className="player-full-name">
          {player.name}
        </div>

        <div className="player-location">
          <span className="nation-display">
            {countryCode ? (
              <span
                className={`fi fi-${countryCode.toLowerCase()} nation-flag`}
                title={player.nation}
                aria-label={`${player.nation} flag`}
              />
            ) : null}

            <span>{player.nation}</span>
          </span>

          <span className="dot">•</span>

          <span>{player.league}</span>
        </div>

        <div className="club">
          {player.club}
        </div>

        <div className="stats-title">
          BASE ATTRIBUTES
        </div>

        <div className="stats-grid">
          {isGK ? (
            <>
              <Stat label="DIV" value={player.pace} />
              <Stat label="HAN" value={player.shooting} />
              <Stat label="KICK" value={player.passing} />
              <Stat label="REF" value={player.dribbling} />
              <Stat label="SPD" value={player.defending} />
              <Stat label="POS" value={player.physical} />
            </>
          ) : (
            <>
              <Stat label="PAC" value={player.pace} />
              <Stat label="SHO" value={player.shooting} />
              <Stat label="PAS" value={player.passing} />
              <Stat label="DRI" value={player.dribbling} />
              <Stat label="DEF" value={player.defending} />
              <Stat label="PHY" value={player.physical} />
            </>
          )}
        </div>

        <button
          type="button"
          className="reset-button"
          onClick={(event) => {
            event.stopPropagation();
            onCompare(player);
          }}
        >
          COMPARE
        </button>
      </div>
    </article>
  );
}

export default PlayerCard;
