import { motion } from "framer-motion";
import type { ReportResponse } from "../../types/report";
import { staggerContainer } from "../../lib/motion";
import { AiSummaryCard } from "../AiSummaryCard";
import { CodeChefStatsCard } from "../CodeChefStatsCard";
import { TopicSection } from "../TopicSection";
import { InterviewPreparationCard } from "../InterviewPreparationCard";

export function CodeChefPanel({ report }: { report: ReportResponse }) {
  const { profile, insights } = report;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 mt-4"
    >
      <AiSummaryCard
        profile={profile}
        insights={insights}
        recommendationCount={report.recommendations?.length || 0}
        delay={0}
      />

      <CodeChefStatsCard report={report} delay={0.1} />

      <TopicSection
        weakTopics={insights.weak_topics}
        strongTopics={insights.strong_topics}
        delay={0.15}
      />

      {report.interview_preparation && (
        <InterviewPreparationCard preparation={report.interview_preparation} delay={0.2} />
      )}
    </motion.div>
  );
}
