import { useMemo, useState } from "react";

const normalizeSearch = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

function PlayerImage({ player, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className={className}>
      {player.image && !imageFailed ? (
        <img
          src={player.image}
          alt=""
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{player.name?.charAt(0) || "?"}</span>
      )}
    </span>
  );
}

function CompareSelector({
  label,
  value,
  excludedId,
  allPlayers,
  onChange,
  onRemove,
  onOpen,
}) {
  const [query, setQuery] = useState("");

  const selectedPlayer = useMemo(
    () => allPlayers.find((player) => String(player.id) === String(value)) || null,
    [allPlayers, value]
  );

  const filteredPlayers = useMemo(() => {
    const search = normalizeSearch(query.trim());
    const candidates = allPlayers.filter((player) =>
      String(player.id) !== String(value) &&
      String(player.id) !== String(excludedId)
    );

    if (!search) return candidates.slice(0, 8);
    return candidates
      .filter((player) => normalizeSearch(player.name).includes(search))
      .slice(0, 20);
  }, [allPlayers, excludedId, query, value]);

  function handleSelect(player) {
    onChange(player);
    setQuery("");
  }

  return (
    <section className="compare-selector" aria-label={`${label} selection`}>
      <div className="compare-selector-heading">
        <span className="compare-selector-index">{label === "PLAYER A" ? "A" : "B"}</span>
        <h3 className="compare-selector-label">{label}</h3>
      </div>

      <div className="compare-picker">
        <label className="compare-search-label" htmlFor={`compare-search-${label === "PLAYER A" ? "a" : "b"}`}>
          SEARCH PLAYER
        </label>
        <input
          id={`compare-search-${label === "PLAYER A" ? "a" : "b"}`}
          type="search"
          className="compare-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${label} by name...`}
          aria-label={`${label} search by player name`}
          autoComplete="off"
        />

        {selectedPlayer ? (
          <div className="compare-selected-card">
            <PlayerImage player={selectedPlayer} className="compare-selected-image" />
            <div className="compare-selected-copy">
              <strong>{selectedPlayer.name}</strong>
              <span>{selectedPlayer.position} <i>•</i> OVR {selectedPlayer.overall}</span>
              <span className="compare-selected-meta">META {selectedPlayer.metaScore} <i>•</i> {selectedPlayer.tier} TIER</span>
            </div>
            <div className="compare-selected-actions">
              <button type="button" className="compare-profile-link" onClick={() => onOpen(selectedPlayer)}>
                VIEW PROFILE
              </button>
              <button type="button" className="compare-remove-button" onClick={onRemove} aria-label={`Remove ${label}`}>
                REMOVE
              </button>
            </div>
          </div>
        ) : null}

        <div className="compare-results" role="group" aria-label={`${label} player results`}>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                className="compare-result"
                aria-label={`Select ${player.name}, ${player.position}, overall ${player.overall}, META ${player.metaScore}`}
                onClick={() => handleSelect(player)}
              >
                <PlayerImage player={player} className="compare-result-image" />
                <span className="compare-result-copy">
                  <strong className="compare-result-name">{player.name}</strong>
                  <span className="compare-result-meta">{player.position} <i>•</i> OVR {player.overall}</span>
                </span>
                <span className="compare-result-score">
                  <strong>{player.metaScore}</strong>
                  <small>META</small>
                </span>
              </button>
            ))
          ) : (
            <div className="compare-no-results" role="status">
              No available players match that name.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CompareSelector;
