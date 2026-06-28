import { GlassCard } from "./GlassCard";
import type { UnifiedProfileResponse } from "../types/report";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BrainCircuit } from "lucide-react";

interface Props {
  data: UnifiedProfileResponse;
}

const COLORS = {
  codeforces: "#3b82f6", // blue
  leetcode: "#f59e0b", // amber
  codechef: "#10b981", // emerald
};

export function UnifiedTopicIntelligence({ data }: Props) {
  const { topicBreakdown } = data;
  
  // Convert topicBreakdown object to an array suitable for Recharts
  // Take top 15 topics by total solved to keep the chart readable
  const chartData = Object.entries(topicBreakdown)
    .map(([topic, stats]) => ({
      name: topic,
      ...(stats as any)
    }))
    .sort((a, b) => (b.total || 0) - (a.total || 0))
    .slice(0, 15);

  return (
    <GlassCard className="p-6" accent="cyan">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Topic Intelligence</h2>
          <p className="text-sm text-gray-400">Cross-platform problem solving breakdown (Top 15)</p>
        </div>
      </div>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#94a3b8" 
              width={100}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="leetcode" name="LeetCode" stackId="a" fill={COLORS.leetcode} radius={[0, 0, 0, 0]} />
            <Bar dataKey="codeforces" name="Codeforces" stackId="a" fill={COLORS.codeforces} radius={[0, 0, 0, 0]} />
            <Bar dataKey="codechef" name="CodeChef" stackId="a" fill={COLORS.codechef} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
