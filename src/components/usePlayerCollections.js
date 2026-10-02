import { useContext } from "react";
import PlayerCollectionsContext from "./PlayerCollectionsContext";

function usePlayerCollections() {
  return useContext(PlayerCollectionsContext);
}

export default usePlayerCollections;
