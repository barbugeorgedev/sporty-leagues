export default function Filters({
  searchTerm,
  onSearchChange,
  selectedSport,
  onSportChange,
  sportOptions,
  totalCount,
}) {
  return (
    <section className="filters">
      <div className="filters-grid">
        <div className="field">
          <label htmlFor="search">Search leagues</label>
          <input
            id="search"
            type="text"
            placeholder="Search by league name..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="sport">Filter by sport</label>
          <select
            id="sport"
            value={selectedSport}
            onChange={(event) => onSportChange(event.target.value)}
          >
            {sportOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="results">
        {totalCount} {totalCount === 1 ? 'league' : 'leagues'} found
      </p>
    </section>
  );
}

