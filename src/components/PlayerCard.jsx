import { useState } from "react";
import usePlayerCollections from "./usePlayerCollections";

const countryCodes = {
  England:"GB-ENG", Scotland:"GB-SCT", Wales:"GB-WLS", "Northern Ireland":"GB-NIR",
  Brazil:"BR", Argentina:"AR", France:"FR", Spain:"ES", Portugal:"PT",
  Germany:"DE", Italy:"IT", Netherlands:"NL", Belgium:"BE", Croatia:"HR",
  Serbia:"RS", Norway:"NO", Sweden:"SE", Denmark:"DK", Poland:"PL",
  "DR Congo":"CD", Georgia:"GE", Guinea:"GN", "New Zealand":"NZ",
  "Republic of Ireland":"IE", Slovenia:"SI", Türkiye:"TR",
  "TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼rkiye":"TR",
  Ukraine:"UA", Austria:"AT", Switzerland:"CH", Turkey:"TR", Greece:"GR",
  Romania:"RO", Hungary:"HU", "Czech Republic":"CZ", Morocco:"MA",
  Algeria:"DZ", Egypt:"EG", Senegal:"SN", Ghana:"GH", Nigeria:"NG",
  Cameroon:"CM", Mali:"ML", "Ivory Coast":"CI", "C�te d'Ivoire":"CI",
  Tunisia:"TN", "South Africa":"ZA", Colombia:"CO", Uruguay:"UY",
  Chile:"CL", Ecuador:"EC", Peru:"PE", Paraguay:"PY", Venezuela:"VE",
  USA:"US", "United States":"US", Canada:"CA", Mexico:"MX", Japan:"JP", "South Korea":"KR",
  Korea:"KR", China:"CN", Australia:"AU", India:"IN", "Saudi Arabia":"SA",
  Qatar:"QA",
};

function getCountryCode(country) {
  return countryCodes[country] || "";
}

function PlayerCard({ player, onOpen, onCompare, rank, compact = false, showCompareButton = true }) {
  const [imageFailed, setImageFailed] = useState(false);
  const collections = usePlayerCollections();
  const countryCode = getCountryCode(player.nation);
  const cardType = player.cardType || player.promoName || "Not listed";
  const isFavourite = collections?.isFavourite(player.id) || false;

  return (
    <article
      className={`player-card${rank ? ` rank-top-${rank}` : ""}${compact ? " compact-card" : ""}`}
      data-meta-tier={player.tier}
      tabIndex={0}
      aria-label={`Open details for ${player.name}, ${player.position}, overall ${player.overall}, META Score ${player.metaScore}, ${player.tier} tier`}
      onClick={() => onOpen(player)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(player);
        }
      }}
    >
      {rank ? <div className="player-rank">#{rank}</div> : null}
      <div className="card-top">
        <div className="rating">
          <span>OVR</span>
          <strong>{player.overall}</strong>
        </div>

        <div className="player-name">{player.name}</div>

        <div className="position-badge">{player.position}</div>
      </div>

      <div className="player-image-area"><div className="image-glow" />
        {collections ? (
          <button
            type="button"
            className={`player-favourite-toggle${isFavourite ? " is-favourite" : ""}`}
            aria-label={`${isFavourite ? "Remove" : "Add"} ${player.name} ${isFavourite ? "from" : "to"} favourites`}
            aria-pressed={isFavourite}
            title={isFavourite ? "Remove from favourites" : "Add to favourites"}
            onClick={(event) => {
              event.stopPropagation();
              collections.toggleFavourite(player.id);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m12 3 2.75 5.58 6.16.9-4.46 4.35 1.05 6.14L12 17.07l-5.5 2.9 1.05-6.14L3.1 9.48l6.16-.9L12 3Z" />
            </svg>
            <span className="sr-only">{isFavourite ? "Favourited" : "Not favourited"}</span>
          </button>
        ) : null}

        {player.image && !imageFailed ? (
          <img
            className="player-image"
            src={player.image}
            alt={player.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="image-placeholder" role="img" aria-label={`${player.name} image unavailable`}>
            {player.name.charAt(0)}
          </div>
        )}

        <div className="meta-score">
          <span>META SCORE</span>
          <strong>{player.metaScore}</strong>
          <small>{player.tier} TIER</small>
        </div>
      </div>

      <div className="player-info">
        <div className="player-full-name">{player.name}</div>

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

          <span className="dot">&bull;</span>
          <span>{player.league}</span>
        </div>

        <div className="club">{player.club}</div>

        <div className="card-type-line">
          <span>{cardType}</span>
          {player.promoName && player.promoName !== cardType ? <span>{player.promoName}</span> : null}
        </div>

        {showCompareButton ? (
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
        ) : null}
      </div>
    </article>
  );
}

export default PlayerCard;
