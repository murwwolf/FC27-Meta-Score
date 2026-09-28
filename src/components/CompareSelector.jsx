function CompareSelector({
  label,
  value,
  allPlayers,
  onChange,
  onRemove,
}) {
  return (
    <div className="compare-selector">
      <div className="compare-selector-label">
        {label}
      </div>

      <div className="filter-box">
        <select
          value={value}
          onChange={(event) => {
            const player = allPlayers.find(
              (item) =>
                String(item.id) === event.target.value
            );

            if (player) {
              onChange(player);
            }
          }}
        >
          <option value="">
            SELECT PLAYER
          </option>

          {allPlayers.map((player) => (
            <option
              key={player.id}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {value && (
        <button
          type="button"
          className="clear-button"
          onClick={onRemove}
        >
          × REMOVE
        </button>
      )}
    </div>
  );
}

export default CompareSelector;
