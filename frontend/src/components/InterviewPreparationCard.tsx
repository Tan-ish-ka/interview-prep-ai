import { motion } from "framer-motion";
import { Briefcase, Map, Target } from "lucide-react";
import type { InterviewPreparation } from "../types/report";
import { GlassCard } from "./GlassCard";

interface InterviewPreparationCardProps {
  preparation: InterviewPreparation;
  delay?: number;
}

const READINESS_CLASS: Record<string, string> = {
  "Interview Ready": "readiness--ready",
  "Nearly Ready": "readiness--nearly",
  Developing: "readiness--developing",
  "Early Stage": "readiness--early",
};

const STATUS_CLASS: Record<string, string> = {
  strong: "focus--strong",
  weak: "focus--weak",
  neutral: "focus--neutral",
  needs_practice: "focus--needs",
};

export function InterviewPreparationCard({
  preparation,
  delay = 0.18,
}: InterviewPreparationCardProps) {
  const readinessClass =
    READINESS_CLASS[preparation.interview_readiness_level] ?? "readiness--developing";

  const weakAreas = preparation.interview_focus_areas.filter(
    (area) => area.status === "weak" || area.status === "needs_practice",
  );
  const strongAreas = preparation.interview_focus_areas.filter(
    (area) => area.status === "strong",
  );

  return (
    <GlassCard className="section-card section-card--interview" delay={delay}>
      <div className="section-card__header">
        <Briefcase size={22} />
        <div>
          <h2>Interview Preparation</h2>
          <p className="section-card__desc">
            Company-interview roadmap separate from skill and momentum scores
          </p>
        </div>
        <span className={`readiness-badge ${readinessClass}`}>
          {preparation.interview_readiness_level}
        </span>
      </div>

      <div className="interview-prep-grid">
        <section className="interview-prep-panel">
          <div className="interview-prep-panel__title">
            <Target size={18} />
            <h3>Focus areas</h3>
          </div>
          <ul className="focus-area-list">
            {preparation.interview_focus_areas.map((area) => (
              <li
                key={area.area}
                className={`focus-area-chip ${STATUS_CLASS[area.status] ?? "focus--neutral"}`}
              >
                <span>{area.area}</span>
                <span className="focus-area-chip__meta">
                  {area.status.replace("_", " ")}
                  {area.solved_count > 0 ? ` · ${area.solved_count}` : ""}
                </span>
              </li>
            ))}
          </ul>
          {weakAreas.length > 0 ? (
            <p className="interview-prep-note">
              Priority gaps: {weakAreas.slice(0, 3).map((a) => a.area).join(", ")}
            </p>
          ) : null}
          {strongAreas.length > 0 ? (
            <p className="interview-prep-note interview-prep-note--positive">
              Confidence builders: {strongAreas.slice(0, 3).map((a) => a.area).join(", ")}
            </p>
          ) : null}
        </section>

        <section className="interview-prep-panel">
          <div className="interview-prep-panel__title">
            <Map size={18} />
            <h3>Roadmap</h3>
          </div>
          <ol className="roadmap-list">
            {preparation.roadmap.map((item) => (
              <motion.li
                key={`${item.priority}-${item.category}`}
                className="roadmap-item"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + item.priority * 0.04 }}
              >
                <span className="roadmap-item__priority">#{item.priority}</span>
                <div>
                  <p className="roadmap-item__title">{item.title}</p>
                  <p className="roadmap-item__desc">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>
      </div>
    </GlassCard>
  );
}
