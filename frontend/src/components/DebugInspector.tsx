import { useState } from "react";
import { Bug, ChevronDown, ChevronUp } from "lucide-react";
import type { ReportResponse } from "../types/report";

export function DebugInspector({ report }: { report: ReportResponse }) {
  const [isOpen, setIsOpen] = useState(false);

  // Only render if in dev mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-gray-900 border border-gray-700 rounded-xl shadow-2xl transition-all duration-300 ${isOpen ? 'w-96' : 'w-auto'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 text-left hover:bg-white/5 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Dev Inspector</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
            <pre className="text-[10px] text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
