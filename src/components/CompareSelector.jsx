import { useMemo, useState } from "react";

function CompareSelector({
  label,
  value,
  allPlayers,
  onChange,
  onRemove,
}) {
  const [query, setQuery] = useState("");

  const selectedPlayer = useMemo(
    () => allPlayers.find((player) => String(player.id) === String(value)) || null,
    [allPlayers, value]
  );

  const filteredPlayers = useMemo(() => {
    const search = query.trim().toLowerCase();

    const basePlayers = allPlayers.filter((player) =>
      String(player.id) !== String(value)
    );

    if (!search) {
      return basePlayers.slice(0, 8);
    }

    return basePlayers.filter((player) =>
      String(player.name || "").toLowerCase().includes(search)
    );
  }, [allPlayers, query, value]);

  const handleSelect = (player) => {
    onChange(player);
    setQuery("");
  };

  return (
    <div className="compare-selector">
      <div className="compare-selector-label">{label}</div>

      <div className="compare-picker">
        <input
          type="text"
          className="compare-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search players..."
          aria-label={`${label} player search`}
        />

        {selectedPlayer ? (
          <div className="compare-selected-card" onClick={() => setQuery(selectedPlayer.name)}>
            <div className="compare-selected-image">
              {selectedPlayer.image ? (
                <img src={selectedPlayer.image} alt={selectedPlayer.name} />
              ) : (
                <span>{selectedPlayer.name?.charAt(0) || "?"}</span>
              )}
            </div>

            <div className="compare-selected-copy">
              <strong>{selectedPlayer.name}</strong>
              <span>{selectedPlayer.position} • OVR {selectedPlayer.overall}</span>
              <small>{selectedPlayer.club}</small>
              <small>{selectedPlayer.nation}</small>
            </div>
          </div>
        ) : null}

        <div className="compare-results" role="listbox" aria-label={`${label} results`}>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                className="compare-result"
                onClick={() => handleSelect(player)}
              >
                <span className="compare-result-name">{player.name}</span>
                <span className="compare-result-meta">{player.position} • OVR {player.overall}</span>
              </button>
            ))
          ) : (
            <div className="compare-no-results">No players found.</div>
          )}
        </div>
      </div>

      {selectedPlayer ? (
        <button type="button" className="clear-button" onClick={onRemove}>
          × REMOVE
        </button>
      ) : null}
    </div>
  );
}

export default CompareSelector;
