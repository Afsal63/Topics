export default function TipsSection({ tips }) {
  if (!tips.length) {
    return null;
  }

  return (
    <section className="tips-section" id="tips-section">
      <h2 className="tips-title">Interview Tips</h2>
      <div className="tips-list">
        {tips.map((tip) => (
          <div key={tip.number} className="tip-item">
            <div className="tip-num">{tip.number}</div>
            <div
              className="tip-text"
              dangerouslySetInnerHTML={{ __html: tip.html }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
