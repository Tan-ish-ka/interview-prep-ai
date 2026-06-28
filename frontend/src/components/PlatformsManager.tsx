import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Terminal, TrophyIcon, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { PlatformConnectionCard } from "./PlatformConnectionCard";
import { CrossPlatformSummary } from "./CrossPlatformSummary";
import { PlatformComparisonTable } from "./PlatformComparisonTable";
import { UnifiedTopicIntelligence } from "./UnifiedTopicIntelligence";
import { UnifiedActivityTimeline } from "./UnifiedActivityTimeline";
import { UnifiedAiInsights } from "./UnifiedAiInsights";
import { usePlatforms } from "../contexts/PlatformContext";
import { fetchPlatformAnalysis } from "../api/report";
import type { UnifiedProfileResponse } from "../types/report";
import { PlatformStorage } from "../lib/PlatformStorage";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export function PlatformsManager() {
  const { connections } = usePlatforms();
  const [showConnections, setShowConnections] = useState(false);
  const [unifiedData, setUnifiedData] = useState<UnifiedProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const connectedUrls = Object.values(connections).map((c) => c.url).join(",");

  const loadUnifiedData = async (force = false) => {
    if (!connectedUrls) return;
    setLoading(true);
    setError(null);
    try {
      if (!force) {
        const cached = PlatformStorage.getCachedReport(connectedUrls);
        if (cached) {
          setUnifiedData(cached as unknown as UnifiedProfileResponse);
          setLoading(false);
          return;
        }
      }
      
      const data = await fetchPlatformAnalysis(connectedUrls);
      PlatformStorage.setCachedReport(connectedUrls, data as any);
      setUnifiedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connectedUrls) {
      loadUnifiedData(false);
    } else {
      setUnifiedData(null);
    }
  }, [connectedUrls]);

  const syncPlatform = async (platform: string, url: string) => {
    const params = new URLSearchParams({ platform, url });
    const response = await fetch(`${API_BASE}/platforms/sync?${params}`, { method: 'POST' });
    
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const body = (await response.json()) as { detail?: string };
        if (body.detail) message = body.detail;
      } catch { }
      throw new Error(message);
    }
    const data = await response.json();
    return { problemsSynced: data.total_solved, contestsSynced: data.total_contests || 0 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Platform Manager</p>
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2">Cross-Platform Intelligence</h1>
          <p className="text-base text-gray-400">Deep analytics and actionable insights for all your connected coding profiles.</p>
        </div>
        
        {unifiedData && (
           <button
             onClick={() => loadUnifiedData(true)}
             disabled={loading}
             className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
           >
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             Refresh All
           </button>
        )}
      </div>

      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowConnections(!showConnections)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Manage Connected Accounts</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
              {Object.keys(connections).length} / 3 Connected
            </span>
          </div>
          {showConnections ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        
        <AnimatePresence>
          {showConnections && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 border-t border-slate-700/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PlatformConnectionCard
                    platform="codeforces"
                    title="Codeforces"
                    Icon={Code2}
                    accent="cyan"
                    onSync={(url) => syncPlatform('codeforces', url)}
                  />
                  <PlatformConnectionCard
                    platform="leetcode"
                    title="LeetCode"
                    Icon={Terminal}
                    accent="orange"
                    onSync={(url) => syncPlatform('leetcode', url)}
                  />
                  <PlatformConnectionCard
                    platform="codechef"
                    title="CodeChef"
                    Icon={TrophyIcon}
                    accent="green"
                    onSync={(url) => syncPlatform('codechef', url)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && !unifiedData && (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading cross-platform intelligence...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {!connectedUrls && !loading && (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
          <p className="text-gray-400 mb-4">No accounts connected yet.</p>
          <button onClick={() => setShowConnections(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
            Connect an Account
          </button>
        </div>
      )}

      {unifiedData && (
        <div className="space-y-8">
          <CrossPlatformSummary data={unifiedData} />
          <PlatformComparisonTable data={unifiedData} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <UnifiedTopicIntelligence data={unifiedData} />
            <UnifiedActivityTimeline data={unifiedData} />
          </div>
          <UnifiedAiInsights data={unifiedData} />
        </div>
      )}
    </motion.div>
  );
}
