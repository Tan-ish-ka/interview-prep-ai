import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Activity } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { ContestReplayContext } from "../api/replay";

interface ContestPersonalityCardProps {
  replays: ContestReplayContext[];
  username: string;
}

export function ContestPersonalityCard({ replays, username }: ContestPersonalityCardProps) {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPersonality() {
      if (replays.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const { API_BASE } = await import("../api/config");
        const res = await fetch(`${API_BASE}/replay/personality`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            username,
            contests: replays
          })
        });

        if (!res.ok) throw new Error("Failed to fetch personality");
        const json = await res.json();
        
        if (mounted) {
          setData(json.radar_data || []);
          setSummary(json.summary || "");
          setIsLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }
    loadPersonality();
    return () => { mounted = false; };
  }, [replays, username]);

  if (replays.length === 0) return null;

  return (
    <GlassCard delay={0.08} className="p-6 h-full flex flex-col" accent="cyan">
       <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
           <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
             <Activity className="w-5 h-5 text-cyan-400" />
           </div>
           <h3 className="text-xl font-black text-white">Contest Personality</h3>
         </div>
         {isLoading && <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-cyan-400 animate-spin" />}
       </div>

       {error ? (
         <div className="text-rose-400 text-sm mt-4">{error}</div>
       ) : (
         <>
           <div className="text-sm text-gray-300 mb-6 italic border-l-2 border-cyan-500/30 pl-3">
             "{summary || "Analyzing your contest behavior patterns..."}"
           </div>

           <div className="flex-1 min-h-[250px] w-full relative">
             {!isLoading && data.length > 0 && (
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                   <PolarGrid stroke="rgba(255,255,255,0.1)" />
                   <PolarAngleAxis dataKey="trait" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: "bold" }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar
                     name="Personality"
                     dataKey="score"
                     stroke="#22d3ee"
                     strokeWidth={2}
                     fill="url(#personalityGradient)"
                     fillOpacity={0.6}
                   />
                   <defs>
                     <linearGradient id="personalityGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                       <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
                     </linearGradient>
                   </defs>
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '12px' }}
                     itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                   />
                 </RadarChart>
               </ResponsiveContainer>
             )}
           </div>
         </>
       )}
    </GlassCard>
  );
}
