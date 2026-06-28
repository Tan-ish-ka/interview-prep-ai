import { GlassCard } from "./GlassCard";
import type { UnifiedProfileResponse } from "../types/report";
import { GitCompare } from "lucide-react";

interface Props {
  data: UnifiedProfileResponse;
}

export function PlatformComparisonTable({ data }: Props) {
  const { platforms } = data;
  
  // Ensure we have exactly 3 columns (pad with N/A if missing)
  const codeforces = platforms["codeforces"]?.profile;
  const codeforcesInsights = platforms["codeforces"]?.insights;
  
  const leetcode = platforms["leetcode"]?.profile;
  const leetcodeInsights = platforms["leetcode"]?.insights;
  
  const codechef = platforms["codechef"]?.profile;
  const codechefInsights = platforms["codechef"]?.insights;

  const getMetric = (val: any) => val !== undefined && val !== null ? val : "Not Available";
  
  const getRatingString = (profile: any, platform: string) => {
    if (!profile) return "Not Available";
    if (platform === 'codeforces') return profile.current_rating ? `${profile.current_rating} (Max: ${profile.max_rating || '?'})` : "Not Available";
    if (platform === 'codechef') return profile.current_rating ? `${profile.current_rating} (Max: ${profile.max_rating || '?'})` : "Not Available";
    if (platform === 'leetcode') return profile.current_rating ? `${Math.round(profile.current_rating)}` : "Not Available";
    return "Not Available";
  };

  return (
    <GlassCard className="p-6 overflow-hidden" accent="default">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
          <GitCompare className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Platform Comparison</h2>
          <p className="text-sm text-gray-400">Side-by-side metric evaluation</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="py-4 px-4 font-semibold text-slate-300 w-1/4">Metric</th>
              <th className="py-4 px-4 font-semibold text-blue-400 w-1/4 text-center border-l border-slate-700/50">Codeforces</th>
              <th className="py-4 px-4 font-semibold text-amber-400 w-1/4 text-center border-l border-slate-700/50">LeetCode</th>
              <th className="py-4 px-4 font-semibold text-emerald-400 w-1/4 text-center border-l border-slate-700/50">CodeChef</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-4 text-slate-300 font-medium">Problems Solved</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{codeforces ? codeforces.total_solved : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{leetcode ? leetcode.total_solved : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{codechef ? codechef.total_solved : "Not Connected"}</td>
            </tr>
            <tr className="hover:bg-slate-800/20 transition-colors bg-slate-800/10">
              <td className="py-4 px-4 text-slate-300 font-medium">Rating</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{getRatingString(codeforces, 'codeforces')}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{getRatingString(leetcode, 'leetcode')}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{getRatingString(codechef, 'codechef')}</td>
            </tr>
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-4 text-slate-300 font-medium">Contest Count</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{codeforcesInsights ? getMetric(codeforcesInsights.contest_stats?.total_contests) : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{leetcodeInsights ? getMetric(leetcodeInsights.contest_stats?.total_contests) : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{codechefInsights ? getMetric(codechefInsights.contest_stats?.total_contests) : "Not Connected"}</td>
            </tr>
            <tr className="hover:bg-slate-800/20 transition-colors bg-slate-800/10">
              <td className="py-4 px-4 text-slate-300 font-medium">Acceptance Rate</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{leetcodeInsights?.platform_specific?.acceptance_rate ? `${leetcodeInsights.platform_specific.acceptance_rate}%` : "Not Available"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
            </tr>
            <tr className="hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-4 text-slate-300 font-medium">Active Days</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{leetcodeInsights ? getMetric(leetcodeInsights.platform_specific?.active_days) : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
            </tr>
            <tr className="hover:bg-slate-800/20 transition-colors bg-slate-800/10">
              <td className="py-4 px-4 text-slate-300 font-medium">Current Streak</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">{leetcodeInsights ? getMetric(leetcodeInsights.platform_specific?.current_streak) : "Not Connected"}</td>
              <td className="py-4 px-4 text-white text-center border-l border-slate-700/50">Not Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
