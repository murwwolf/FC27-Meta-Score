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
  cardTypeFilter,
  setCardTypeFilter,
  cardTypes,
  minRating,
  setMinRating,
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
            {players.length}
          </span>

          <span className="counter-text">
            PLAYERS
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
          <select value={minRating} onChange={(event) => setMinRating(event.target.value)} aria-label="Minimum overall">
            <option value="All">Any Overall</option>
            {[90, 85, 80, 75, 70].map((rating) => (
              <option key={rating} value={rating}>{rating}+ Overall</option>
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
          <select value={cardTypeFilter} onChange={(event) => setCardTypeFilter(event.target.value)} aria-label="Card type">
            {cardTypes.map((item) => (
              <option key={item} value={item}>{item === "All" ? "All Card Types" : item}</option>
            ))}
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

            <option value="pac-desc">
              PAC — High to Low
            </option>

            <option value="sho-desc">
              SHO — High to Low
            </option>

            <option value="pas-desc">
              PAS — High to Low
            </option>

            <option value="dri-desc">
              DRI — High to Low
            </option>

            <option value="def-desc">
              DEF — High to Low
            </option>

            <option value="phy-desc">
              PHY — High to Low
            </option>
          </select>
        </div>
      </div>

      {players.length === 0 ? (
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
