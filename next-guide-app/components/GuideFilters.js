export default function GuideFilters({
  levels,
  search,
  activeLevel,
  onSearchChange,
  onLevelChange,
}) {
  const options = ["all", ...levels];

  return (
    <>
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          className="search-input"
          value={search}
          placeholder="Search questions, concepts, answers..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-row">
        {options.map((level) => (
          <button
            key={level}
            type="button"
            className={`filter-btn ${activeLevel === level ? "active" : ""}`}
            onClick={() => onLevelChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </>
  );
}
