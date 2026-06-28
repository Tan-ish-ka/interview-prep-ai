import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Unplug, Plug, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { usePlatforms } from "../contexts/PlatformContext";
import { PlatformStorage } from "../lib/PlatformStorage";
import { fetchReport } from "../api/report";
import type { ReportResponse } from "../types/report";
import { CodeforcesPanel } from "./PlatformDashboards/CodeforcesPanel";
import { LeetCodePanel } from "./PlatformDashboards/LeetCodePanel";
import { CodeChefPanel } from "./PlatformDashboards/CodeChefPanel";

interface Props {
  platform: "codeforces" | "leetcode" | "codechef";
  title: string;
  Icon: any;
  accent: "cyan" | "orange" | "green";
  onSync: (url: string) => Promise<{ problemsSynced: number; contestsSynced: number }>;
}

export function PlatformConnectionCard({ platform, title, Icon, accent, onSync }: Props) {
  const { connections, addConnection, removeConnection, updateConnection } = usePlatforms();
  const connection = connections[platform];
  const isConnected = !!connection;

  const [inputUrl, setInputUrl] = useState(connection?.url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard state
  const [isExpanded, setIsExpanded] = useState(false);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Lazy load report when expanded
  useEffect(() => {
    if (isExpanded && isConnected && !report && !loadingReport) {
      loadReport(false);
    }
  }, [isExpanded, isConnected]);

  const loadReport = async (forceRefresh = false) => {
    if (!connection) return;
    setLoadingReport(true);
    setError(null);
    try {
      if (!forceRefresh) {
        const cached = PlatformStorage.getCachedReport(connection.url);
        if (cached) {
          setReport(cached);
          setLoadingReport(false);
          return;
        }
      }
      
      const data = await fetchReport(connection.url);
      PlatformStorage.setCachedReport(connection.url, data);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load platform analytics");
    } finally {
      setLoadingReport(false);
    }
  };

  const formatUrl = (input: string, platform: string) => {
    let url = input.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    switch (platform) {
      case 'codeforces': return `https://codeforces.com/profile/${url}`;
      case 'leetcode': return `https://leetcode.com/u/${url}/`;
      case 'codechef': return `https://www.codechef.com/users/${url}`;
      default: return url;
    }
  };

  const getUsernameFromUrl = (url: string, platform: string) => {
    if (platform === 'leetcode' && url.includes('leetcode.com/u/')) {
      return url.split('leetcode.com/u/')[1].replace(/\//g, '');
    }
    if (platform === 'codeforces' && url.includes('codeforces.com/profile/')) {
      return url.split('codeforces.com/profile/')[1].replace(/\//g, '');
    }
    if (platform === 'codechef' && url.includes('codechef.com/users/')) {
      return url.split('codechef.com/users/')[1].replace(/\//g, '');
    }
    return url.split('/').filter(Boolean).pop() || url;
  };

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const fullUrl = formatUrl(inputUrl, platform);
      
      // Basic validation
      if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
         throw new Error("Invalid URL or username provided.");
      }

      const result = await onSync(fullUrl);
      addConnection({
        platform,
        url: fullUrl,
        username: getUsernameFromUrl(fullUrl, platform),
        lastSyncTime: new Date().toISOString(),
        problemsSynced: result.problemsSynced,
        contestsSynced: result.contestsSynced
      });
      // Expand automatically on connect
      setIsExpanded(true);
      setInputUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connection) return;
    setLoading(true);
    setError(null);
    try {
      const result = await onSync(connection.url);
      updateConnection(platform, {
        lastSyncTime: new Date().toISOString(),
        problemsSynced: result.problemsSynced,
        contestsSynced: result.contestsSynced
      });
      // Force refresh analytics cache as well
      await loadReport(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeConnection(platform);
    setIsExpanded(false);
    setReport(null);
  };

  const toggleExpand = () => {
    if (isConnected) setIsExpanded(!isExpanded);
  };

  return (
    <GlassCard className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'col-span-1 md:col-span-3 p-8' : 'p-6 cursor-pointer'}`} accent={accent} onClick={!isExpanded ? toggleExpand : undefined}>
      <div className={`flex items-center justify-between ${isExpanded ? 'mb-8' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-${accent}-400`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {title}
              {isConnected && (
                <span className="flex items-center gap-1 text-xs text-green-400 font-medium px-2 py-0.5 rounded-full bg-green-500/10 border border-green-400/20">
                  <CheckCircle2 size={12} /> Connected
                </span>
              )}
            </h3>
            {isConnected && !isExpanded && (
              <p className="text-xs text-gray-400 mt-1">@{connection.username} • {connection.problemsSynced} solved</p>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all ${loading ? 'opacity-50' : ''}`}
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading || loadingReport ? 'spin' : ''}`} />
            </button>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="p-2 hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-400 transition-all"
              title="Disconnect"
            >
              <Unplug className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all ml-2 border border-white/5 bg-white/5"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {!isConnected ? (
        <form onSubmit={handleConnect} className="space-y-4" onClick={e => e.stopPropagation()}>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Profile URL or Username</label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={`e.g. tourist`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputUrl.trim()}
            className={`w-full py-2 px-4 bg-${accent}-500/10 hover:bg-${accent}-500/20 border border-${accent}-500/20 rounded-lg text-sm font-bold text-${accent}-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <Loader2 className="w-4 h-4 spin" /> : <Plug className="w-4 h-4" />}
            Connect Account
          </button>
        </form>
      ) : isExpanded ? (
        <div className="mt-4 pt-4 border-t border-white/5">
          {loadingReport ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className={`w-8 h-8 spin mb-4 text-${accent}-400`} />
              <p>Fetching deep analytics...</p>
            </div>
          ) : report ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {platform === "codeforces" && <CodeforcesPanel report={report} />}
              {platform === "leetcode" && <LeetCodePanel report={report} />}
              {platform === "codechef" && <CodeChefPanel report={report} />}
            </div>
          ) : (
            <div className="py-8 text-center text-rose-400">
              <p>Failed to load analytics.</p>
              <button onClick={() => loadReport(true)} className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10">Try Again</button>
            </div>
          )}
        </div>
      ) : null}

      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </GlassCard>
  );
}
