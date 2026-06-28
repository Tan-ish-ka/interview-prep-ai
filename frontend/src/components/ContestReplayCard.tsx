import { useState } from "react";
import { Clock, Trophy, XOctagon, Sparkles, MessageSquare, FastForward } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { ContestReplay, ContestTimelineEvent } from "../types/report";
import { streamReplayAnalysis, streamReplaySimulation, streamReplayChat } from "../api/replay";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CardTab = "timeline" | "simulator" | "chat";

interface ContestReplayCardProps {
  replay: ContestReplay;
  username: string;
  delay: number;
}

export function ContestReplayCard({ replay, username, delay }: ContestReplayCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CardTab>("timeline");

  // Simulator State
  const [scenarioInput, setScenarioInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationText, setSimulationText] = useState("");
  
  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const handleAnalyze = async () => {
    if (analysisText) return; // Already analyzed
    setIsAnalyzing(true);
    setError(null);
    setAnalysisText("");
    setActiveTab("timeline");

    await streamReplayAnalysis(
      {
        username,
        contest: replay
      },
      (chunk) => {
        setAnalysisText((prev) => prev + chunk);
      },
      (err) => {
        setError(err);
        setIsAnalyzing(false);
      },
      () => {
        setIsAnalyzing(false);
      }
    );
  };

  const handleSimulate = async () => {
    if (!scenarioInput.trim()) return;
    setIsSimulating(true);
    setError(null);
    setSimulationText("");

    await streamReplaySimulation(
      {
        username,
        contest: replay,
        what_if_scenario: scenarioInput
      },
      (chunk) => setSimulationText((prev) => prev + chunk),
      (err) => { setError(err); setIsSimulating(false); },
      () => setIsSimulating(false)
    );
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setIsChatting(true);
    setError(null);

    let fullResponse = "";
    
    await streamReplayChat(
      {
        username,
        contest: replay,
        message: msg,
        conversation: chatHistory
      },
      (chunk) => {
        fullResponse += chunk;
        setChatHistory((prev) => {
          const next = [...prev];
          next[next.length - 1].content = fullResponse;
          return next;
        });
      },
      (err) => { setError(err); setIsChatting(false); },
      () => setIsChatting(false)
    );
  };

  return (
    <GlassCard delay={delay} className="p-6 transition-all duration-500" accent="default">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4">
          <div>
             <h4 className="text-xl font-black text-white">Contest {replay.contest_id}</h4>
             <p className="text-xs text-gray-500">{new Date(replay.date).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-4 mt-3 md:mt-0 items-center">
             <div className="text-center">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Solved</div>
                <div className="text-lg font-black text-cyan-400">{replay.problems_solved}/{replay.problems_attempted}</div>
             </div>
             <div className="text-center">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Penalty</div>
                <div className="text-lg font-black text-rose-400">{replay.total_penalty_time}m</div>
             </div>
             {replay.time_wasted_minutes > 0 && (
                <div className="text-center">
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time Wasted</div>
                   <div className="text-lg font-black text-amber-400">{replay.time_wasted_minutes}m</div>
                </div>
             )}
             <button
               onClick={handleAnalyze}
               disabled={isAnalyzing || analysisText.length > 0}
               className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/30 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all disabled:opacity-50"
             >
                {isAnalyzing ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-cyan-400 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                )}
                {analysisText ? "Analyzed" : "Analyze AI"}
             </button>
          </div>
       </div>

       {error && (
         <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
           {error}
         </div>
       )}

       {/* AI Analysis Streamed Result */}
       {(analysisText || isAnalyzing) && (
         <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <div className="flex items-center gap-2 mb-4 text-cyan-400 text-sm font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Intelligent Contest Report
            </div>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-cyan-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisText}
              </ReactMarkdown>
            </div>
         </div>
       )}

       {/* Tabs Navigation */}
       <div className="flex gap-4 border-b border-white/5 mb-6">
         <button onClick={() => setActiveTab("timeline")} className={`pb-2 text-sm font-bold transition-colors ${activeTab === "timeline" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
           Timeline & Decisions
         </button>
         <button onClick={() => setActiveTab("simulator")} className={`pb-2 text-sm font-bold transition-colors ${activeTab === "simulator" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
           What-If Simulator
         </button>
         <button onClick={() => setActiveTab("chat")} className={`pb-2 text-sm font-bold transition-colors ${activeTab === "chat" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
           Replay Chat
         </button>
       </div>

       {activeTab === "timeline" && (
         <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {replay.timeline.map((event: ContestTimelineEvent, eventIdx: number) => {
              const isAC = event.event === "AC";
              const isWasted = event.event === "TIME_WASTED";
              
              return (
                <div key={eventIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#0f172a] absolute left-0 md:left-1/2 -translate-x-1/2 bg-[#0f172a] shadow shrink-0 z-10 ${
                     isAC ? "text-cyan-400" : isWasted ? "text-amber-400" : "text-rose-400"
                  }`}>
                     {isAC ? <Trophy className="w-4 h-4" /> : isWasted ? <Clock className="w-4 h-4" /> : <XOctagon className="w-4 h-4" />}
                  </div>

                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                       <span className={`font-bold ${isAC ? "text-cyan-400" : isWasted ? "text-amber-400" : "text-rose-400"}`}>
                         Problem {event.problem}
                       </span>
                       <span className="text-xs font-bold text-gray-500">{event.time_minutes}m</span>
                    </div>
                    <p className="text-sm text-gray-300">{event.description}</p>
                  </div>
                </div>
              );
            })}
         </div>
       )}

       {activeTab === "simulator" && (
         <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
             <FastForward className="w-4 h-4" /> Test alternative strategies
           </div>
           <div className="flex gap-2">
             <input
               type="text"
               value={scenarioInput}
               onChange={(e) => setScenarioInput(e.target.value)}
               placeholder="e.g. If I skipped B after 12 minutes"
               className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
               onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
             />
             <button
               onClick={handleSimulate}
               disabled={isSimulating}
               className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
             >
               Simulate
             </button>
           </div>
           {simulationText && (
             <div className="mt-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 prose prose-invert prose-sm max-w-none prose-a:text-cyan-400 prose-strong:text-cyan-300">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{simulationText}</ReactMarkdown>
             </div>
           )}
         </div>
       )}

       {activeTab === "chat" && (
         <div className="space-y-4">
           <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
             {chatHistory.length === 0 ? (
               <div className="text-center py-8 text-gray-500 text-sm">
                 Ask me why you lost rating or how to improve based on this specific contest.
               </div>
             ) : (
               chatHistory.map((msg, i) => (
                 <div key={i} className={`p-4 rounded-xl text-sm ${msg.role === 'user' ? 'bg-white/5 ml-8 border border-white/10' : 'bg-cyan-500/10 mr-8 border border-cyan-500/20'}`}>
                   {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                   ) : msg.content}
                 </div>
               ))
             )}
           </div>
           <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
             <input
               type="text"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               placeholder="Ask AI about this contest..."
               className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
               onKeyDown={(e) => e.key === "Enter" && handleChat()}
             />
             <button
               onClick={handleChat}
               disabled={isChatting}
               className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition-colors disabled:opacity-50"
             >
               <MessageSquare className="w-5 h-5" />
             </button>
           </div>
         </div>
       )}
    </GlassCard>
  );
}
