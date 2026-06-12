import { motion } from "framer-motion";
import { Brain, Zap, TrendingUp, CheckCircle, Gauge } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface AiInsight {
  summary: string;
  strengths: string;
  growth_opportunity: string;
  recommendation: string;
  readiness_score: number;
}

interface AIInsightCardProps {
  aiInsight: AiInsight;
  delay?: number;
}

function getReadinessStatus(score: number): string {
  if (score >= 70) return "High Readiness";
  if (score >= 50) return "Growing";
  return "Needs Focus";
}

export function AIInsightCard({
  aiInsight,
  delay = 0.05,
}: AIInsightCardProps) {
  const readinessColor =
    aiInsight.readiness_score >= 70
      ? "#6ee7b7"
      : aiInsight.readiness_score >= 50
        ? "#fbbf24"
        : "#f87171";

  const readinessStatus = getReadinessStatus(aiInsight.readiness_score);

  return (
    <GlassCard className="ai-insight-card" delay={delay} accent="purple">
      {/* Header */}
      <div className="ai-insight-card__header">
        <motion.div
          className="ai-insight-card__icon"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Brain size={24} />
        </motion.div>
        <div>
          <motion.p
            className="ai-insight-card__label"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.05 }}
          >
            AI Insight
          </motion.p>
          <motion.h3
            className="ai-insight-card__title"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.1 }}
          >
            AI Performance Insight
          </motion.h3>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        className="ai-insight-card__section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.15 }}
      >
        <p className="ai-insight-card__text">{aiInsight.summary}</p>
      </motion.div>

      {/* Strengths */}
      <motion.div
        className="ai-insight-card__section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        <div className="ai-insight-card__section-label">
          <Zap size={16} className="ai-insight-card__icon-sm" />
          <span>Strengths</span>
        </div>
        <p className="ai-insight-card__text">{aiInsight.strengths}</p>
      </motion.div>

      {/* Growth Opportunity */}
      <motion.div
        className="ai-insight-card__section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.25 }}
      >
        <div className="ai-insight-card__section-label">
          <TrendingUp size={16} className="ai-insight-card__icon-sm" />
          <span>Growth Opportunity</span>
        </div>
        <p className="ai-insight-card__text">
          {aiInsight.growth_opportunity}
        </p>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        className="ai-insight-card__section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <div className="ai-insight-card__section-label">
          <CheckCircle size={16} className="ai-insight-card__icon-sm" />
          <span>Recommendation</span>
        </div>
        <p className="ai-insight-card__text">{aiInsight.recommendation}</p>
      </motion.div>

      {/* Readiness Score */}
      <motion.div
        className="ai-insight-card__score-section"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.35 }}
      >
        <div className="ai-insight-card__score-header">
          <div className="ai-insight-card__score-label">
            <Gauge size={16} />
            <span>Readiness Score</span>
          </div>
          <div
            className="ai-insight-card__score-status"
            style={{ color: readinessColor }}
          >
            {readinessStatus}
          </div>
        </div>
        <div className="ai-insight-card__score-bar">
          <motion.div
            className="ai-insight-card__score-fill"
            initial={{ width: 0 }}
            animate={{ width: `${aiInsight.readiness_score}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.4 }}
            style={{ backgroundColor: readinessColor }}
          />
        </div>
        <div
          className="ai-insight-card__score-value"
          style={{ color: readinessColor }}
        >
          {aiInsight.readiness_score}/100
        </div>
      </motion.div>
    </GlassCard>
  );
}
