export default function GuideSidebar({
  categories,
  counts,
  activeCategory,
  progress,
  onSelectCategory,
  onJumpToTips,
}) {
  return (
    <aside className="guide-sidebar">
      <div className="progress-panel">
        <div className="progress-label">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="sidebar-label">Topics</p>

      <button
        type="button"
        className={`sidebar-pill ${activeCategory === null ? "active" : ""}`}
        onClick={() => onSelectCategory(null)}
      >
        <span>All</span>
        <span className="sidebar-count">
          {Object.values(counts).reduce((sum, count) => sum + count, 0)}
        </span>
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`sidebar-pill ${activeCategory === category ? "active" : ""}`}
          onClick={() => onSelectCategory(category)}
        >
          <span>{category}</span>
          <span className="sidebar-count">{counts[category] || 0}</span>
        </button>
      ))}

      <button type="button" className="sidebar-pill" onClick={onJumpToTips}>
        <span>Interview Tips</span>
      </button>
    </aside>
  );
}
