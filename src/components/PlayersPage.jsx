import PlayerCard from "./PlayerCard";

function PlayersPage({
  players,
  search,
  setSearch,
  position,
  setPosition,
  tier,
  setTier,
  leagueFilter,
  setLeagueFilter,
  clubFilter,
  setClubFilter,
  nationFilter,
  setNationFilter,
  sortBy,
  setSortBy,
  positions,
  leagues,
  clubs,
  nations,
  onOpen,
  onCompare,
  onClear,
}) {
  const hasSearched = search.trim().length > 0;

  return (
    <main className="players-section">
      <div className="hero-top">
        <div className="gold-line" />

        <div className="hero-label">
          PLAYER DATABASE
        </div>

        <div className="gold-line" />
      </div>

      <div className="section-header">
        <div>
          <div className="section-label">
            FC27 DATABASE
          </div>

          <h2>ALL PLAYERS</h2>
        </div>

        <div className="database-counter">
          <span className="counter-number">
            {hasSearched ? players.length : "—"}
          </span>

          <span className="counter-text">
            {hasSearched ? "PLAYERS" : "SEARCH"}
          </span>
        </div>

        <button
          type="button"
          className="clear-button"
          onClick={onClear}
        >
          CLEAR FILTERS
        </button>
      </div>

      <div className="filters">
        <div className="filter-box search-box">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search players..."
          />
        </div>

        <div className="filter-box">
          <select
            value={position}
            onChange={(event) =>
              setPosition(event.target.value)
            }
          >
            {positions.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Positions"
                  : item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={tier}
            onChange={(event) =>
              setTier(event.target.value)
            }
          >
            <option value="All">All Tiers</option>
            <option value="S">S Tier</option>
            <option value="A">A Tier</option>
            <option value="B">B Tier</option>
            <option value="C">C Tier</option>
            <option value="D">D Tier</option>
          </select>
        </div>

        <div className="filter-box">
          <select
            value={leagueFilter}
            onChange={(event) =>
              setLeagueFilter(event.target.value)
            }
          >
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league === "All"
                  ? "All Leagues"
                  : league}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={clubFilter}
            onChange={(event) =>
              setClubFilter(event.target.value)
            }
          >
            {clubs.map((club) => (
              <option key={club} value={club}>
                {club === "All"
                  ? "All Clubs"
                  : club}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={nationFilter}
            onChange={(event) =>
              setNationFilter(event.target.value)
            }
          >
            {nations.map((nation) => (
              <option key={nation} value={nation}>
                {nation === "All"
                  ? "All Nations"
                  : nation}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="meta-desc">
              META Rating — High to Low
            </option>

            <option value="meta-asc">
              META Rating — Low to High
            </option>

            <option value="ovr-desc">
              OVR — High to Low
            </option>

            <option value="ovr-asc">
              OVR — Low to High
            </option>

            <option value="name-asc">
              Name — A to Z
            </option>

            <option value="name-desc">
              Name — Z to A
            </option>

            <option value="pace-desc">
              Pace — High to Low
            </option>

            <option value="shooting-desc">
              Shooting — High to Low
            </option>

            <option value="passing-desc">
              Passing — High to Low
            </option>

            <option value="dribbling-desc">
              Dribbling — High to Low
            </option>

            <option value="defending-desc">
              Defending — High to Low
            </option>

            <option value="physical-desc">
              Physical — High to Low
            </option>
          </select>
        </div>
      </div>

      {!hasSearched ? (
        <div className="empty-state">
          <div className="empty-symbol">⌕</div>

          <h3>Search the FC27 database</h3>

          <p>
            Search for a player to view their FC27 META
            card and detailed stats.
          </p>
        </div>
      ) : players.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">×</div>

          <h3>No players found</h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            type="button"
            className="reset-button"
            onClick={onClear}
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onOpen={onOpen}
              onCompare={onCompare}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default PlayersPage;
