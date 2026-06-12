import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CalendarDays, Flag } from "lucide-react";
import { GlassCard } from "./GlassCard";

type ActivityEntry = {
  date: string;
  problemsSolved: number;
  contests: number;
  activityScore: number;
};

interface ActivityHeatmapProps {
  data: ActivityEntry[];
  loading?: boolean;
}

const COLOR_SCALE = [
  "#1a1028",
  "#3b1f6b",
  "#5b21b6",
  "#7c3aed",
  "#a855f7",
];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getLast365Days() {
  const today = new Date();
  const days = [] as Date[];
  const copy = new Date(today);
  copy.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i += 1) {
    const next = new Date(copy);
    next.setDate(copy.getDate() - i);
    days.unshift(next);
  }

  return days;
}

function buildWeeks(days: Date[]) {
  const weeks: Date[][] = [];
  let week: Date[] = [];

  days.forEach((date) => {
    if (date.getDay() === 0 && week.length) {
      weeks.push(week);
      week = [];
    }
    week.push(date);
  });

  if (week.length) {
    weeks.push(week);
  }

  return weeks;
}

function mapScoreToLevel(score: number) {
  if (score <= 0) return 0;
  if (score < 25) return 1;
  if (score < 50) return 2;
  if (score < 75) return 3;
  return 4;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ActivityHeatmap({ data, loading = false }: ActivityHeatmapProps) {
  const entriesByDate = new Map<string, ActivityEntry>();
  data.forEach((entry) => entriesByDate.set(entry.date, entry));

  const days = getLast365Days();
  const weeks = buildWeeks(days);
  const totalSolved = data.reduce((sum, entry) => sum + entry.problemsSolved, 0);
  const totalContests = data.reduce((sum, entry) => sum + entry.contests, 0);
  const activeDays = data.filter((entry) => entry.problemsSolved > 0 || entry.contests > 0).length;
  const averageScore = data.length
    ? Math.round(data.reduce((sum, entry) => sum + entry.activityScore, 0) / data.length)
    : 0;

  const [hovered, setHovered] = useState<null | {
    entry: ActivityEntry | null;
    date: Date;
    x: number;
    y: number;
  }>(null);

  return (
    <GlassCard className="overflow-hidden" accent="purple" delay={0}>
      <div className="px-6 py-6 md:px-8 md:py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c4b5fd]">
              Activity Heatmap
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Last 365 Days of Performance
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#cbd5e1] sm:text-base">
              Visualize weekly momentum using a GitHub contribution-style graph with dark purple intensity.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#a78bfa]">Problems Solved</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totalSolved}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#a78bfa]">Contests</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totalContests}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#a78bfa]">Avg. Activity</p>
              <p className="mt-2 text-2xl font-semibold text-white">{averageScore}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid gap-2 rounded-3xl border border-white/10 bg-[#130c25]/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-10 min-w-[4.5rem] animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            </motion.div>
          ) : data.length === 0 ? (
            <motion.div
              key="empty"
              className="rounded-3xl border border-white/10 bg-[#130c25]/70 p-10 text-center text-[#cbd5e1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[#a78bfa]">
                <Flag className="h-8 w-8" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">No activity data available</p>
              <p className="mt-2 text-sm text-[#a3aed0]">Add daily problem solving and contest entries to fill the heatmap.</p>
            </motion.div>
          ) : (
            <motion.div
              key="heatmap"
              className="space-y-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#a78bfa]">Intensity Scale</p>
                  <div className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                    {COLOR_SCALE.map((color, index) => (
                      <div key={color} className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-md border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                        <span>{index}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#cbd5e1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                  <div className="mb-2 flex items-center gap-2 text-[#a78bfa]">
                    <CalendarDays className="h-4 w-4" />
                    <span>Last 365 days</span>
                  </div>
                  <p className="font-semibold text-white">{activeDays} active days</p>
                </div>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="min-w-[840px] rounded-3xl border border-white/10 bg-[#12081f]/80 p-4">
                  <div className="grid grid-cols-[auto_repeat(53,minmax(12px,1fr))] gap-2">
                    <div />
                    {weeks.map((week, weekIndex) => (
                      <div key={`week-${weekIndex}`} className="space-y-2">
                        {week.map((date) => {
                          const key = toDateKey(date);
                          const entry = entriesByDate.get(key) ?? { date: key, problemsSolved: 0, contests: 0, activityScore: 0 };
                          const level = mapScoreToLevel(entry.activityScore);
                          const color = COLOR_SCALE[level];
                          return (
                            <motion.div
                              key={key}
                              className="h-9 w-9 rounded-lg border border-white/10 transition-all duration-200"
                              style={{ backgroundColor: color }}
                              whileHover={{ scale: 1.1 }}
                              onMouseEnter={(event) => setHovered({ entry: entry.activityScore || entry.problemsSolved || entry.contests ? entry : null, date, x: event.clientX, y: event.clientY })}
                              onMouseLeave={() => setHovered(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {hovered && hovered.entry && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="pointer-events-none fixed z-50 max-w-xs rounded-3xl border border-white/15 bg-[#150c28]/95 p-4 shadow-2xl shadow-black/30 text-sm text-[#e2e8f0]"
                    style={{
                      top: hovered.y + 18,
                      left: hovered.x + 18,
                      transform: "translate3d(0,0,0)",
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-[#a78bfa]">{formatDateLabel(hovered.date)}</p>
                    <div className="mt-3 space-y-2 text-white">
                      <p className="font-semibold">Problems Solved: {hovered.entry.problemsSolved}</p>
                      <p>Contests: {hovered.entry.contests}</p>
                      <p>Activity Score: {hovered.entry.activityScore}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}

export default ActivityHeatmap;
