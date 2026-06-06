"use client";

import { useState } from "react";

function levelClass(level) {
  if (level === "design") return "badge-design";
  if (level === "advanced") return "badge-advanced";
  if (level === "intermediate") return "badge-intermediate";
  return "badge-basic";
}

export default function QuestionSection({
  category,
  items,
  viewedSet,
  onViewed,
}) {
  const [openIndexes, setOpenIndexes] = useState([]);

  function toggle(index) {
    setOpenIndexes((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
    );
    onViewed(index);
  }

  return (
    <section className="guide-section">
      <div className="section-header">
        <h2 className="section-title">{category}</h2>
        <div className="section-count">{items.length} questions</div>
      </div>

      {items.map((item) => {
        const isOpen = openIndexes.includes(item.index);
        const isViewed = viewedSet.has(item.index);
        const hasLevel = Boolean(item.level);

        return (
          <article
            key={`${item.section}-${item.index}`}
            className={`qa-card ${item.level === "design" ? "design" : ""} ${isOpen ? "open" : ""}`}
          >
            <button
              type="button"
              className="qa-question"
              onClick={() => toggle(item.index)}
            >
              <span className="qa-num">{String(item.index + 1).padStart(2, "0")}</span>
              <span className="qa-q-text">{item.q}</span>
              <span className="qa-meta">
                {hasLevel ? (
                  <span className={`badge ${levelClass(item.level)}`}>{item.level}</span>
                ) : null}
                <span className={`viewed-dot ${isViewed ? "done" : ""}`} />
                <span className="chevron">{isOpen ? "▲" : "▼"}</span>
              </span>
            </button>

            {isOpen ? (
              <div className="qa-answer">
                <div
                  className="ans-body"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
