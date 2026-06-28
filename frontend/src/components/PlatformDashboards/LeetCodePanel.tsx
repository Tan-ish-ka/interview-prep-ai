import { motion } from "framer-motion";
import type { ReportResponse } from "../../types/report";
import { staggerContainer } from "../../lib/motion";
import { AiSummaryCard } from "../AiSummaryCard";
import { LeetCodeStatsCard } from "../LeetCodeStatsCard";
import { SkillMatrix } from "../SkillMatrix";
import { InterviewPreparationCard } from "../InterviewPreparationCard";

export function LeetCodePanel({ report }: { report: ReportResponse }) {
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

      <LeetCodeStatsCard report={report} delay={0.1} />

      <SkillMatrix report={report} delay={0.15} />

      {report.interview_preparation && (
        <InterviewPreparationCard preparation={report.interview_preparation} delay={0.2} />
      )}
    </motion.div>
  );
}
