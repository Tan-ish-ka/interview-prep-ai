import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RatingPoint } from "../lib/ratingHistory";

interface RatingTrendChartProps {
  data: RatingPoint[];
}

export function RatingTrendChart({ data }: RatingTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">Not enough contest history to plot a trend.</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} domain={["auto", "auto"]} width={42} />
        <Tooltip
          contentStyle={{
            background: "rgba(12, 18, 32, 0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
          formatter={(value: number) => [`${value}`, "Rating"]}
        />
        <Area
          type="monotone"
          dataKey="rating"
          stroke="#a5b4fc"
          strokeWidth={2.5}
          fill="url(#ratingFill)"
          dot={{ r: 3, fill: "#c7d2fe", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#67e8f9" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
