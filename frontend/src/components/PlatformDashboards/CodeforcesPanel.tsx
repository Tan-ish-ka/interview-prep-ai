import { motion } from "framer-motion";
import type { ReportResponse } from "../../types/report";
import { staggerContainer } from "../../lib/motion";
import { RatingAnalytics } from "../RatingAnalytics";
import { ActivityAnalytics } from "../ActivityAnalytics";
import { ContestAnalytics } from "../ContestAnalytics";
import { FailureIntelligenceCard } from "../FailureIntelligenceCard";
import { LearningDNACard } from "../LearningDNACard";
import { HiddenPotentialCard } from "../HiddenPotentialCard";
import { AiSummaryCard } from "../AiSummaryCard";
import { TopicSection } from "../TopicSection";
import { InterviewPreparationCard } from "../InterviewPreparationCard";

export function CodeforcesPanel({ report }: { report: ReportResponse }) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingAnalytics profile={profile} insights={insights} delay={0.1} />
        <ActivityAnalytics
          stats={insights.activity_stats}
          recentActivity={insights.recent_activity}
          delay={0.12}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContestAnalytics stats={insights.contest_stats} delay={0.14} />
        <div className="md:col-span-2">
          <HiddenPotentialCard data={report.hidden_potential} delay={0.15} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FailureIntelligenceCard data={report.failure_intelligence} />
        <LearningDNACard data={report.learning_dna} delay={0.16} />
      </div>

      <TopicSection
        weakTopics={insights.weak_topics}
        strongTopics={insights.strong_topics}
        delay={0.18}
      />
      
      {report.interview_preparation && (
        <InterviewPreparationCard preparation={report.interview_preparation} delay={0.2} />
      )}
    </motion.div>
  );
}
