import { Lightbulb } from "lucide-react";

interface RecommendationsProps {
  items: string[];
}

export function Recommendations({ items }: RecommendationsProps) {
  return (
    <section className="glass-card section-card">
      <div className="section-card__header">
        <Lightbulb size={22} />
        <h2>Recommendations</h2>
      </div>
      {items.length === 0 ? (
        <p className="section-card__desc">You&apos;re on track — no recommendations right now.</p>
      ) : (
        <ul className="recommendation-list">
          {items.map((text, index) => (
            <li key={`${index}-${text.slice(0, 24)}`}>
              <span className="recommendation-list__index">{index + 1}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
