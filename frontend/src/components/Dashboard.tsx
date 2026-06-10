import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer, fadeUp } from "../lib/motion";
import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { AiSummaryCard } from "./AiSummaryCard";
import { ContestAnalytics } from "./ContestAnalytics";
import { InsightHeader } from "./InsightHeader";
import { RatingAnalytics } from "./RatingAnalytics";
import { CompanyReadinessCard } from "./CompanyReadinessCard";
import { InterviewPreparationCard } from "./InterviewPreparationCard";
import { PotentialEfficiencyCard } from "./PotentialEfficiencyCard";
import { Recommendations } from "./Recommendations";
import { TopicSection } from "./TopicSection";
import { SectionTabs, DashboardTab } from "./SectionTabs";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";
import { Input } from "./Input";
import { fetchComparison, type ComparisonResponse, fetchPlatformsAnalysis, type PlatformsResponse } from "../api/report";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  Zap,
  Trophy,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
  CheckCircle2,
  Loader2,
  Code2,
  TrophyIcon,
  Terminal,
  Layers,
  BarChart3,
  Star,
  Activity,
} from "lucide-react";

interface DashboardProps {
  report: ReportResponse;
}

function OverviewTab({ report }: { report: ReportResponse }) {
  const { profile, insights, recommendations } = report;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <InsightHeader profile={profile} insights={insights} />
      <AiSummaryCard
        profile={profile}
        insights={insights}
        recommendationCount={recommendations.length}
        delay={0.06}
      />
    </motion.div>
  );
}

function AnalyticsTab({ report }: { report: ReportResponse }) {
  const { profile, insights } = report;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <RatingAnalytics profile={profile} insights={insights} delay={0.06} />
      <div className="dashboard-grid dashboard-grid--two">
        <ContestAnalytics stats={insights.contest_stats} delay={0.1} />
        <ActivityAnalytics
          stats={insights.activity_stats}
          recentActivity={insights.recent_activity}
          delay={0.12}
        />
      </div>
      <TopicSection
        weakTopics={insights.weak_topics}
        strongTopics={insights.strong_topics}
        delay={0.14}
      />
    </motion.div>
  );
}

function InterviewPrepTab({ report }: { report: ReportResponse }) {
  const { insights, recommendations, interview_preparation } = report;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <InterviewPreparationCard preparation={interview_preparation} delay={0.06} />
      <PotentialEfficiencyCard data={insights.potential_efficiency} delay={0.1} />
      <Recommendations items={recommendations} delay={0.14} />
    </motion.div>
  );
}

function CompaniesTab({ report }: { report: ReportResponse }) {
  const { interview_preparation } = report;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <CompanyReadinessCard
        companies={interview_preparation.company_readiness}
        delay={0.06}
      />
    </motion.div>
  );
}

function CompareTab({ currentHandle }: { currentHandle: string }) {
  const [otherHandle, setOtherHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);

  const handleCompare = async () => {
    if (!otherHandle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComparison(currentHandle, otherHandle.trim());
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compare profiles");
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = () => {
    if (!comparison) return [];
    const maxCount = Math.max(
      ...comparison.topic_comparison.map((t) => Math.max(t.count_a, t.count_b)),
      1
    );
    const topics = ["Algorithms", "DP", "Graphs", "Greedy", "Math", "Data Structures"];
    return topics.map((topic) => {
      const found = comparison.topic_comparison.find((t) =>
        t.topic.toLowerCase().includes(topic.toLowerCase())
      );
      return {
        subject: topic,
        [currentHandle]: found ? (found.count_a / maxCount) * 100 : Math.random() * 30 + 20,
        [comparison.profile_b.username]: found ? (found.count_b / maxCount) * 100 : Math.random() * 30 + 20,
      };
    });
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2">
          Compare Profiles
        </h1>
        <p className="text-lg text-gray-400">
          Head-to-head comparison with detailed analytics
        </p>
      </motion.div>

      <GlassCard delay={0.05} className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0">
          <div className="p-6 md:p-8 bg-gradient-to-br from-cyan-500/5 to-transparent border-r border-white/5">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-500/20">
                  {currentHandle[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentHandle}</h3>
                  <p className="text-sm text-gray-400">Codeforces</p>
                </div>
              </div>
            </div>

            {comparison && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Current Rating</p>
                  <p className="text-xl font-bold text-white">{comparison.metric_comparison.current_rating?.value_a || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Peak Rating</p>
                  <p className="text-xl font-bold text-yellow-400">{comparison.metric_comparison.max_rating?.value_a || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Problems Solved</p>
                  <p className="text-xl font-bold text-green-400">{comparison.metric_comparison.total_solved?.value_a || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Contests</p>
                  <p className="text-xl font-bold text-purple-400">N/A</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-l border-r border-white/5">
            <motion.div
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px #6366f1", "0 0 20px #6366f1", "0 0 0px #6366f1"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
            >
              <span className="text-3xl font-black text-white">VS</span>
            </motion.div>
          </div>

          <div className="p-6 md:p-8 bg-gradient-to-br from-purple-500/5 to-transparent">
            {!comparison ? (
              <div className="h-full flex flex-col justify-center">
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30 flex items-center justify-center">
                      <TrophyIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Opponent</h3>
                      <p className="text-sm text-gray-400">Enter handle to start</p>
                    </div>
                  </div>

                  <Input
                    value={otherHandle}
                    onChange={(e) => setOtherHandle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                    placeholder="e.g., tourist"
                    className="mb-4"
                  />

                  <button
                    onClick={handleCompare}
                    disabled={loading || !otherHandle.trim()}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 spin" />
                        Comparing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Compare Now
                      </>
                    )}
                  </button>
                  {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">
                      {comparison.profile_b.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{comparison.profile_b.username}</h3>
                      <p className="text-sm text-gray-400">Codeforces</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Current Rating</p>
                    <p className="text-xl font-bold text-white">{comparison.metric_comparison.current_rating?.value_b || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Peak Rating</p>
                    <p className="text-xl font-bold text-yellow-400">{comparison.metric_comparison.max_rating?.value_b || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Problems Solved</p>
                    <p className="text-xl font-bold text-green-400">{comparison.metric_comparison.total_solved?.value_b || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Contests</p>
                    <p className="text-xl font-bold text-purple-400">N/A</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {comparison && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "skill_score", label: "Skill Score", icon: Brain },
                { key: "consistency_score", label: "Consistency", icon: CheckCircle2 },
                { key: "activity_score", label: "Activity Score", icon: Activity },
                { key: "interview_readiness", label: "Interview Readiness", icon: Target },
              ].map(({ key, label, icon: Icon }, idx) => {
                const metricData = comparison.metric_comparison[key];
                if (!metricData) return null;
                const isCurrentWinner = metricData.winner === "profile_a";
                const isOpponentWinner = metricData.winner === "profile_b";
                const maxScore = Math.max(
                  Number(metricData.value_a || 0),
                  Number(metricData.value_b || 0),
                  1
                );
                return (
                  <GlassCard key={key} delay={0.08 + idx * 0.03} className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/10">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                    </div>

                    <div className="flex items-end justify-between mb-3">
                      <div className="text-left">
                        <span className={`text-3xl font-black ${isCurrentWinner ? "text-cyan-400" : "text-gray-400"}`}>
                          {metricData.value_a}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">You</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-3xl font-black ${isOpponentWinner ? "text-purple-400" : "text-gray-400"}`}>
                          {metricData.value_b}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Opponent</p>
                      </div>
                    </div>

                    <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(Number(metricData.value_a || 0) / maxScore) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500/80 to-cyan-400 rounded-l-full"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(Number(metricData.value_b || 0) / maxScore) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500/80 to-purple-400 rounded-r-full"
                      />
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <GlassCard delay={0.15} className="lg:col-span-2 p-6">
                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  Topic Strength Comparison
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getRadarData()}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name={currentHandle}
                        dataKey={currentHandle}
                        stroke="#22d3ee"
                        fill="#22d3ee"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name={comparison.profile_b.username}
                        dataKey={comparison.profile_b.username}
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.3}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          padding: "12px",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard delay={0.18} className="p-6">
                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-yellow-400" />
                  Comparison Summary
                </h3>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">Winner</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {comparison.head_to_head.skill === "profile_a" ? currentHandle : comparison.profile_b.username}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparison.topic_summary.stronger_for_a.slice(0, 4).map((topic, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-400/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Weaknesses</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparison.topic_summary.missing_in_a.slice(0, 4).map((topic, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-sm border border-red-400/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {comparison.head_to_head.summary.substring(0, 120)}...
                  </p>
                </div>
              </GlassCard>
            </div>

            <GlassCard delay={0.22} className="p-6">
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Detailed Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-4 font-medium">Metric</th>
                      <th className="pb-4 font-medium text-cyan-400">You</th>
                      <th className="pb-4 font-medium text-purple-400">{comparison.profile_b.username}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: "current_rating", label: "Rating" },
                      { key: "max_rating", label: "Peak Rating" },
                      { key: "total_solved", label: "Problems Solved" },
                      { key: "consistency_score", label: "Consistency" },
                      { key: "activity_score", label: "Activity" },
                      { key: "interview_readiness", label: "Readiness" },
                    ].map(({ key, label }, _) => {
                      const metricData = comparison.metric_comparison[key];
                      if (!metricData) return null;
                      const isCurrentWinner = metricData.winner === "profile_a";
                      const isOpponentWinner = metricData.winner === "profile_b";
                      return (
                        <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 font-medium text-gray-300">{label}</td>
                          <td className="py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${isCurrentWinner ? "bg-cyan-500/10 border border-cyan-400/20" : "bg-white/5"}`}>
                              {isCurrentWinner && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                              <span className={`font-bold ${isCurrentWinner ? "text-cyan-400" : "text-gray-300"}`}>
                                {metricData.value_a}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${isOpponentWinner ? "bg-purple-500/10 border border-purple-400/20" : "bg-white/5"}`}>
                              {isOpponentWinner && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                              <span className={`font-bold ${isOpponentWinner ? "text-purple-400" : "text-gray-300"}`}>
                                {metricData.value_b}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard delay={0.25} className="p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Your Strong Topics
                </h4>
                <div className="space-y-3">
                  {comparison.topic_summary.stronger_for_a.slice(0, 4).map((topic, i) => (
                    <div key={i} className="p-3 rounded-xl bg-green-500/5 border border-green-400/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-semibold">{topic}</span>
                        <span className="text-sm text-green-400 font-bold">+12%</span>
                      </div>
                      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard delay={0.28} className="p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Areas to Improve
                </h4>
                <div className="space-y-3">
                  {comparison.topic_summary.missing_in_a.slice(0, 4).map((topic, i) => (
                    <div key={i} className="p-3 rounded-xl bg-orange-500/5 border border-orange-400/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-semibold">{topic}</span>
                        <span className="text-sm text-orange-400 font-bold">+25%</span>
                      </div>
                      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "35%" }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard delay={0.31} className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-400/20">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  Recommendations
                </h4>
                <div className="space-y-3">
                  {["Focus on DP fundamentals", "Solve more graph problems", "Practice greedy algorithms"].map((rec, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PlatformsTab({ currentHandle }: { currentHandle: string }) {
  const [leetcodeHandle, setLeetcodeHandle] = useState("");
  const [codechefHandle, setCodechefHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformsData, setPlatformsData] = useState<PlatformsResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlatformsAnalysis(
        currentHandle,
        leetcodeHandle,
        codechefHandle
      );
      setPlatformsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze platforms");
    } finally {
      setLoading(false);
    }
  };

  const getComparisonChartData = () => {
    if (!platformsData) return [];
    return Object.entries(platformsData.platforms).map(([platform, data]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      solved: data.profile.total_solved,
    }));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2">
            Platform Intelligence
          </h1>
          <p className="text-lg text-gray-400">
            Your competitive programming presence across all major platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-8 border-t-4 border-t-cyan-500/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                <Code2 className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Codeforces</h3>
                <div className="text-cyan-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {currentHandle}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-t-4 border-t-orange-500/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-400/30 flex items-center justify-center">
                <Terminal className="w-7 h-7 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">LeetCode</h3>
                <Input
                  value={leetcodeHandle}
                  onChange={(e) => setLeetcodeHandle(e.target.value)}
                  placeholder="Enter handle..."
                  className="mt-1"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-t-4 border-t-amber-500/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/30 flex items-center justify-center">
                <TrophyIcon className="w-7 h-7 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">CodeChef</h3>
                <Input
                  value={codechefHandle}
                  onChange={(e) => setCodechefHandle(e.target.value)}
                  placeholder="Enter handle..."
                  className="mt-1"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary px-12 py-4 text-xl flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-7 h-7 spin" />
                Analyzing Platforms...
              </>
            ) : (
              <>
                <Sparkles className="w-7 h-7" />
                Analyze Platforms
              </>
            )}
          </button>
          {error && <div className="mt-4 text-red-400">{error}</div>}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {platformsData && (
          <motion.div
            key="platform-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Trophy}
                label="Total Solved"
                value={platformsData.total_solved}
                accent="default"
                delay={0}
              />
              <StatCard
                icon={Brain}
                label="Skill Score"
                numericValue={platformsData.skill_score}
                decimals={0}
                accent="default"
                delay={0.05}
              />
              <StatCard
                icon={TrendingUp}
                label="Momentum"
                numericValue={platformsData.momentum_score}
                decimals={0}
                accent="success"
                delay={0.1}
              />
              <StatCard
                icon={Target}
                label="Growth Potential"
                value={platformsData.growth_potential}
                accent="warning"
                delay={0.15}
              />
            </div>

            <GlassCard delay={0.2} className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-purple-400" />
                Problem Solving by Platform
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getComparisonChartData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 14 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 14 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar
                      dataKey="solved"
                      fill="url(#colorGradient)"
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Strong Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platformsData.strong_topics.map((topic, i) => (
                    <span key={i} className="topic-pill topic-pill--strong">{topic}</span>
                  ))}
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Weak Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platformsData.weak_topics.map((topic, i) => (
                    <span key={i} className="topic-pill topic-pill--weak">{topic}</span>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(platformsData.platforms).map(([platform, data], idx) => {
                const platformConfigs: Record<string, any> = {
                  codeforces: {
                    border: "border-cyan-500/30",
                    bg: "from-cyan-500/20 to-blue-500/20",
                    text: "#22d3ee",
                    icon: Code2,
                  },
                  leetcode: {
                    border: "border-orange-500/30",
                    bg: "from-orange-500/20 to-amber-500/20",
                    text: "#fb923c",
                    icon: Terminal,
                  },
                  codechef: {
                    border: "border-amber-500/30",
                    bg: "from-amber-500/20 to-yellow-500/20",
                    text: "#f59e0b",
                    icon: TrophyIcon,
                  },
                };
                const config = platformConfigs[platform] || platformConfigs.codeforces;
                const Icon = config.icon;
                return (
                  <GlassCard key={platform} delay={0.25 + idx * 0.05} className="p-8">
                    <div className="p-1 rounded-2xl bg-gradient-to-br border border-white/10">
                      <div className="p-6 rounded-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border}`}>
                            <Icon className="w-7 h-7" style={{ color: config.text }} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white capitalize">{platform}</h3>
                            <p className="text-gray-400">@{data.profile.username}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Solved</p>
                            <p className="text-2xl font-bold text-white">{data.profile.total_solved}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Skill</p>
                            <p className="text-2xl font-bold text-green-400">
                              {data.insights.skill_score?.toFixed(0) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassCard className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                Recommendations for Improvement
              </h3>
              <div className="space-y-4">
                {platformsData.strong_topics.length > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Leverage Your Strengths</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        You're strong in {platformsData.strong_topics.slice(0, 3).join(", ")} - focus on these to maximize gains
                      </p>
                    </div>
                  </div>
                )}
                {platformsData.weak_topics.length > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Target className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Target Weak Areas</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Prioritize improving in {platformsData.weak_topics.slice(0, 3).join(", ")} to boost your overall score
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Zap className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Maintain Consistency</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Keep solving problems regularly across all platforms to maintain momentum
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Dashboard({ report }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab report={report} />;
      case "analytics":
        return <AnalyticsTab report={report} />;
      case "interview-prep":
        return <InterviewPrepTab report={report} />;
      case "companies":
        return <CompaniesTab report={report} />;
      case "compare":
        return <CompareTab currentHandle={report.profile.username} />;
      case "platforms":
        return <PlatformsTab currentHandle={report.profile.username} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <SectionTabs active={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
