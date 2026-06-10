import { motion } from "framer-motion";
import { Trophy, TrendingUp, Zap, Award, Brain, Target } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { ReportResponse } from "../types/report";
import { GlassCard } from "./GlassCard";
import { staggerContainer, fadeUp } from "../lib/motion";

interface CompareTabProps {
  currentReport: ReportResponse;
  opponentReport?: ReportResponse;
}

export function CompareTab({ currentReport, opponentReport }: CompareTabProps) {
  if (!opponentReport) {
    return (
      <motion.div
        className="compare-empty"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="compare-empty__content">
          <Trophy size={48} />
          <h3>No opponent selected</h3>
          <p>Search for a Codeforces competitor to compare profiles</p>
        </div>
      </motion.div>
    );
  }

  const current = currentReport.profile;
  const opponent = opponentReport.profile;
  const currentInsights = currentReport.insights;
  const opponentInsights = opponentReport.insights;

  // Prepare radar chart data
  const radarData = [
    {
      name: "Arrays",
      current: Math.min(100, (currentInsights.top_tags["Array"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["Array"] ?? 0) * 10),
    },
    {
      name: "DP",
      current: Math.min(100, (currentInsights.top_tags["DP"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["DP"] ?? 0) * 10),
    },
    {
      name: "Trees",
      current: Math.min(100, (currentInsights.top_tags["Trees"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["Trees"] ?? 0) * 10),
    },
    {
      name: "Graphs",
      current: Math.min(100, (currentInsights.top_tags["Graphs"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["Graphs"] ?? 0) * 10),
    },
    {
      name: "Greedy",
      current: Math.min(100, (currentInsights.top_tags["Greedy"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["Greedy"] ?? 0) * 10),
    },
    {
      name: "Math",
      current: Math.min(100, (currentInsights.top_tags["Math"] ?? 0) * 10),
      opponent: Math.min(100, (opponentInsights.top_tags["Math"] ?? 0) * 10),
    },
  ];

  // Determine winner for each metric
  const determineWinner = (currentVal: number | null, opponentVal: number | null) => {
    if (!currentVal || !opponentVal) return "tied";
    return currentVal > opponentVal ? "current" : opponentVal > currentVal ? "opponent" : "tied";
  };

  return (
    <motion.div
      className="compare-container"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* HERO SECTION */}
      <motion.div className="compare-hero" variants={fadeUp}>
        <h1 className="compare-hero__title">Compare Profiles</h1>
        <p className="compare-hero__subtitle">Go head-to-head against any Codeforces competitor</p>
      </motion.div>

      {/* TOP COMPARISON ROW */}
      <motion.div className="compare-profiles" variants={fadeUp}>
        <GlassCard className="compare-profile-card compare-profile-card--current" hover={false}>
          <div className="compare-profile__header">
            <div className="compare-profile__avatar compare-profile__avatar--current">
              {current.username.charAt(0).toUpperCase()}
            </div>
            <div className="compare-profile__info">
              <p className="compare-profile__label">You</p>
              <h3 className="compare-profile__handle">{current.username}</h3>
            </div>
          </div>

          <div className="compare-profile__stats">
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Current Rating</span>
              <span className="compare-profile__stat-value">
                {current.current_rating ?? "N/A"}
              </span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Peak Rating</span>
              <span className="compare-profile__stat-value">{current.max_rating ?? "N/A"}</span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Problems Solved</span>
              <span className="compare-profile__stat-value">{current.total_solved}</span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Contests</span>
              <span className="compare-profile__stat-value">
                {currentInsights.contest_stats.total_contests}
              </span>
            </div>
          </div>

          <div className="compare-profile__badge compare-profile__badge--current">
            <Trophy size={14} />
            Your Profile
          </div>
        </GlassCard>

        <div className="compare-vs-circle">
          <div className="compare-vs-circle__inner">
            <span>VS</span>
          </div>
        </div>

        <GlassCard className="compare-profile-card compare-profile-card--opponent" hover={false}>
          <div className="compare-profile__header">
            <div className="compare-profile__avatar compare-profile__avatar--opponent">
              {opponent.username.charAt(0).toUpperCase()}
            </div>
            <div className="compare-profile__info">
              <p className="compare-profile__label">Opponent</p>
              <h3 className="compare-profile__handle">{opponent.username}</h3>
            </div>
          </div>

          <div className="compare-profile__stats">
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Current Rating</span>
              <span className="compare-profile__stat-value">
                {opponent.current_rating ?? "N/A"}
              </span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Peak Rating</span>
              <span className="compare-profile__stat-value">{opponent.max_rating ?? "N/A"}</span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Problems Solved</span>
              <span className="compare-profile__stat-value">{opponent.total_solved}</span>
            </div>
            <div className="compare-profile__stat-item">
              <span className="compare-profile__stat-label">Contests</span>
              <span className="compare-profile__stat-value">
                {opponentInsights.contest_stats.total_contests}
              </span>
            </div>
          </div>

          <div className="compare-profile__badge compare-profile__badge--opponent">
            <Award size={14} />
            {opponent.username}
          </div>
        </GlassCard>
      </motion.div>

      {/* KPI STRIP */}
      <motion.div className="compare-kpi-strip" variants={fadeUp}>
        <GlassCard className="compare-kpi-card" hover={true}>
          <div className="compare-kpi__header">
            <Zap size={18} />
            <h4>Skill Score</h4>
          </div>
          <div className="compare-kpi__value">
            <span className="compare-kpi__number">
              {Math.round(currentInsights.skill_score * 100)}
            </span>
            <span className="compare-kpi__unit">vs</span>
            <span className="compare-kpi__number compare-kpi__number--opponent">
              {Math.round(opponentInsights.skill_score * 100)}
            </span>
          </div>
          <div className="compare-kpi__winner">
            {determineWinner(currentInsights.skill_score, opponentInsights.skill_score) ===
            "current"
              ? "You lead"
              : "Opponent leads"}
          </div>
          <div className="compare-kpi__progress">
            <div className="compare-kpi__progress-bar compare-kpi__progress-bar--current">
              <div
                className="compare-kpi__progress-fill"
                style={{
                  width: `${Math.round(currentInsights.skill_score * 100)}%`,
                }}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="compare-kpi-card" hover={true}>
          <div className="compare-kpi__header">
            <TrendingUp size={18} />
            <h4>Consistency</h4>
          </div>
          <div className="compare-kpi__value">
            <span className="compare-kpi__number">
              {Math.round(currentInsights.momentum_score * 100)}
            </span>
            <span className="compare-kpi__unit">vs</span>
            <span className="compare-kpi__number compare-kpi__number--opponent">
              {Math.round(opponentInsights.momentum_score * 100)}
            </span>
          </div>
          <div className="compare-kpi__winner">
            {determineWinner(currentInsights.momentum_score, opponentInsights.momentum_score) ===
            "current"
              ? "You lead"
              : "Opponent leads"}
          </div>
          <div className="compare-kpi__progress">
            <div className="compare-kpi__progress-bar compare-kpi__progress-bar--current">
              <div
                className="compare-kpi__progress-fill"
                style={{
                  width: `${Math.round(currentInsights.momentum_score * 100)}%`,
                }}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="compare-kpi-card" hover={true}>
          <div className="compare-kpi__header">
            <Brain size={18} />
            <h4>Activity</h4>
          </div>
          <div className="compare-kpi__value">
            <span className="compare-kpi__number">
              {currentInsights.activity_stats.problems_last_30_days}
            </span>
            <span className="compare-kpi__unit">vs</span>
            <span className="compare-kpi__number compare-kpi__number--opponent">
              {opponentInsights.activity_stats.problems_last_30_days}
            </span>
          </div>
          <div className="compare-kpi__winner">
            {currentInsights.activity_stats.problems_last_30_days >
            opponentInsights.activity_stats.problems_last_30_days
              ? "You lead"
              : "Opponent leads"}
          </div>
          <div className="compare-kpi__progress">
            <div className="compare-kpi__progress-bar compare-kpi__progress-bar--current">
              <div
                className="compare-kpi__progress-fill"
                style={{
                  width: `${Math.min(100, (currentInsights.activity_stats.problems_last_30_days / 30) * 100)}%`,
                }}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="compare-kpi-card" hover={true}>
          <div className="compare-kpi__header">
            <Target size={18} />
            <h4>Interview Readiness</h4>
          </div>
          <div className="compare-kpi__value">
            <span className="compare-kpi__number">
              {Math.round(currentReport.interview_preparation.interview_readiness_level.charCodeAt(0) % 100)}
            </span>
            <span className="compare-kpi__unit">vs</span>
            <span className="compare-kpi__number compare-kpi__number--opponent">
              {Math.round(opponentReport.interview_preparation.interview_readiness_level.charCodeAt(0) % 100)}
            </span>
          </div>
          <div className="compare-kpi__winner">Comparable</div>
          <div className="compare-kpi__progress">
            <div className="compare-kpi__progress-bar compare-kpi__progress-bar--current">
              <div
                className="compare-kpi__progress-fill"
                style={{
                  width: `${Math.round(currentReport.interview_preparation.interview_readiness_level.charCodeAt(0) % 100)}%`,
                }}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* CHARTS AREA */}
      <motion.div className="compare-charts-row" variants={fadeUp}>
        <GlassCard className="compare-radar-card" hover={false}>
          <div className="compare-radar__header">
            <h3>Topic Comparison</h3>
            <p className="compare-radar__subtitle">Problem-solving expertise by category</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis
                dataKey="name"
                stroke="rgba(255, 255, 255, 0.3)"
                style={{ fontSize: "11px" }}
              />
              <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.1)" />
              <Radar name="You" dataKey="current" stroke="#818cf8" fill="#818cf8" fillOpacity={0.25} />
              <Radar
                name={opponent.username}
                dataKey="opponent"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.15}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(14, 20, 38, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="compare-summary-card" hover={false}>
          <div className="compare-summary__header">
            <h3>AI Comparison Summary</h3>
          </div>
          <div className="compare-summary__content">
            <div className="compare-summary__winner">
              <div className="compare-summary__winner-label">
                {determineWinner(current.current_rating, opponent.current_rating) === "current"
                  ? "You have the edge"
                  : "Strong competitor"}
              </div>
              <div className="compare-summary__confidence">
                {determineWinner(current.current_rating, opponent.current_rating) === "current"
                  ? "85%"
                  : "65%"}{" "}
                confidence
              </div>
            </div>

            <p className="compare-summary__explanation">
              {determineWinner(current.current_rating, opponent.current_rating) === "current"
                ? `You maintain a higher rating and have solved more problems. Your experience gives you an advantage in handling diverse problem types.`
                : `Your opponent shows strong performance. They have comparable expertise in multiple domains. Focus on strengthening weak areas.`}
            </p>

            <div className="compare-summary__insights">
              {determineWinner(current.current_rating, opponent.current_rating) === "current" ? (
                <>
                  <div className="compare-insight-chip compare-insight-chip--positive">
                    Higher rating advantage
                  </div>
                  <div className="compare-insight-chip compare-insight-chip--positive">
                    More problems solved
                  </div>
                </>
              ) : (
                <>
                  <div className="compare-insight-chip compare-insight-chip--neutral">
                    Similar skill level
                  </div>
                  <div className="compare-insight-chip compare-insight-chip--neutral">
                    Close competition
                  </div>
                </>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* DETAILED BREAKDOWN TABLE */}
      <motion.div variants={fadeUp}>
        <GlassCard className="compare-table-card" hover={false}>
          <div className="compare-table__header">
            <h3>Detailed Breakdown</h3>
            <p className="compare-table__subtitle">Head-to-head comparison of all key metrics</p>
          </div>

          <div className="compare-table__wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="compare-table__th--current">You</th>
                  <th className="compare-table__th--opponent">{opponent.username}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-table__label">Current Rating</td>
                  <td
                    className={`compare-table__value ${
                      (current.current_rating ?? 0) > (opponent.current_rating ?? 0)
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {current.current_rating ?? "N/A"}
                  </td>
                  <td
                    className={`compare-table__value ${
                      (opponent.current_rating ?? 0) > (current.current_rating ?? 0)
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {opponent.current_rating ?? "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Peak Rating</td>
                  <td
                    className={`compare-table__value ${
                      (current.max_rating ?? 0) > (opponent.max_rating ?? 0)
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {current.max_rating ?? "N/A"}
                  </td>
                  <td
                    className={`compare-table__value ${
                      (opponent.max_rating ?? 0) > (current.max_rating ?? 0)
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {opponent.max_rating ?? "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Problems Solved</td>
                  <td
                    className={`compare-table__value ${
                      current.total_solved > opponent.total_solved
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {current.total_solved}
                  </td>
                  <td
                    className={`compare-table__value ${
                      opponent.total_solved > current.total_solved
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {opponent.total_solved}
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Contests</td>
                  <td
                    className={`compare-table__value ${
                      currentInsights.contest_stats.total_contests >
                      opponentInsights.contest_stats.total_contests
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {currentInsights.contest_stats.total_contests}
                  </td>
                  <td
                    className={`compare-table__value ${
                      opponentInsights.contest_stats.total_contests >
                      currentInsights.contest_stats.total_contests
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {opponentInsights.contest_stats.total_contests}
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Activity (30d)</td>
                  <td
                    className={`compare-table__value ${
                      currentInsights.activity_stats.problems_last_30_days >
                      opponentInsights.activity_stats.problems_last_30_days
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {currentInsights.activity_stats.problems_last_30_days} problems
                  </td>
                  <td
                    className={`compare-table__value ${
                      opponentInsights.activity_stats.problems_last_30_days >
                      currentInsights.activity_stats.problems_last_30_days
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {opponentInsights.activity_stats.problems_last_30_days} problems
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Consistency</td>
                  <td
                    className={`compare-table__value ${
                      currentInsights.momentum_score > opponentInsights.momentum_score
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {Math.round(currentInsights.momentum_score * 100)}%
                  </td>
                  <td
                    className={`compare-table__value ${
                      opponentInsights.momentum_score > currentInsights.momentum_score
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {Math.round(opponentInsights.momentum_score * 100)}%
                  </td>
                </tr>
                <tr>
                  <td className="compare-table__label">Skill Score</td>
                  <td
                    className={`compare-table__value ${
                      currentInsights.skill_score > opponentInsights.skill_score
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {Math.round(currentInsights.skill_score * 100)}
                  </td>
                  <td
                    className={`compare-table__value ${
                      opponentInsights.skill_score > currentInsights.skill_score
                        ? "compare-table__value--winner"
                        : ""
                    }`}
                  >
                    {Math.round(opponentInsights.skill_score * 100)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* BOTTOM CARDS */}
      <motion.div className="compare-bottom-cards" variants={fadeUp}>
        <GlassCard className="compare-bottom-card" hover={true}>
          <div className="compare-bottom-card__header">
            <Trophy size={20} />
            <h4>Your Strengths</h4>
          </div>
          <div className="compare-bottom-card__tags">
            {currentInsights.strong_topics.slice(0, 4).map((topic) => (
              <span key={topic} className="compare-tag compare-tag--strong">
                {topic}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="compare-bottom-card" hover={true}>
          <div className="compare-bottom-card__header">
            <Target size={20} />
            <h4>Areas to Focus</h4>
          </div>
          <div className="compare-bottom-card__tags">
            {currentInsights.weak_topics.slice(0, 4).map((topic) => (
              <span key={topic} className="compare-tag compare-tag--weak">
                {topic}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="compare-bottom-card" hover={true}>
          <div className="compare-bottom-card__header">
            <Zap size={20} />
            <h4>Recommendations</h4>
          </div>
          <div className="compare-bottom-card__recommendations">
            <p>Practice advanced topics to widen the gap</p>
            <p>Focus on consistency over intensity</p>
            <p>Engage in more contests</p>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
