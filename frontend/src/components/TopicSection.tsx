import { ShieldAlert, ShieldCheck } from "lucide-react";

interface TopicSectionProps {
  weakTopics: string[];
  strongTopics: string[];
}

export function TopicSection({ weakTopics, strongTopics }: TopicSectionProps) {
  return (
    <div className="dashboard-grid dashboard-grid--two">
      <section className="glass-card section-card">
        <div className="section-card__header">
          <ShieldAlert size={22} />
          <h2>Weak topics</h2>
        </div>
        <p className="section-card__desc">Topics with fewer than 5 solved problems — focus areas.</p>
        <div className="topic-list">
          {weakTopics.length === 0 ? (
            <span className="empty-chip">No weak topics identified</span>
          ) : (
            weakTopics.map((tag) => (
              <span key={tag} className="topic-pill topic-pill--weak">
                {tag}
              </span>
            ))
          )}
        </div>
      </section>

      <section className="glass-card section-card">
        <div className="section-card__header">
          <ShieldCheck size={22} />
          <h2>Strong topics</h2>
        </div>
        <p className="section-card__desc">Top 3 topics by solved count — your strengths.</p>
        <div className="topic-list">
          {strongTopics.length === 0 ? (
            <span className="empty-chip">No strong topics yet</span>
          ) : (
            strongTopics.map((tag) => (
              <span key={tag} className="topic-pill topic-pill--strong">
                {tag}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
