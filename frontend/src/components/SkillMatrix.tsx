import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { fadeUp } from "../lib/motion";
import { GlassCard } from "./GlassCard";
import type { ReportResponse } from "../types/report";
import { Crosshair } from "lucide-react";

interface SkillMatrixProps {
  report: ReportResponse;
  delay?: number;
}

export function SkillMatrix({ report, delay = 0 }: SkillMatrixProps) {
  const { skill_matrix } = report;

  if (!skill_matrix || Object.keys(skill_matrix).length === 0) {
    return null;
  }

  const data = Object.entries(skill_matrix).map(([subject, value]) => ({
    subject,
    A: value,
    fullMark: 100,
  }));

  return (
    <motion.div variants={fadeUp} custom={delay} className="col-span-1">
      <GlassCard className="p-6 h-full" accent="emerald">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
            <Crosshair className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Cross-Platform Skill Matrix</h3>
            <p className="text-xs text-emerald-200/60 mt-0.5">Synthesized proficiency</p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Proficiency"
                dataKey="A"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                itemStyle={{ color: "#10b981", fontWeight: "bold" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
