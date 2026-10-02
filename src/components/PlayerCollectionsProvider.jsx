import PlayerCollectionsContext from "./PlayerCollectionsContext";

function PlayerCollectionsProvider({ value, children }) {
  return (
    <PlayerCollectionsContext.Provider value={value}>
      {children}
    </PlayerCollectionsContext.Provider>
  );
}

export default PlayerCollectionsProvider;
