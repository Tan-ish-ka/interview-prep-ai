import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Upload, Zap, AlertTriangle, Cpu, BookOpen,
  Building2, Lightbulb, RefreshCw, X, ChevronDown, Sparkles, FileCode
} from "lucide-react";
import { streamSolutionAnalysis } from "../api/solution";
import type { ReportResponse } from "../types/report";
import { staggerContainer } from "../lib/motion";

interface SolutionIntelligenceTabProps {
  report: ReportResponse;
}

type Language = "cpp" | "java" | "python" | "javascript" | "other";
type Verdict = "" | "OK" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "MEMORY_LIMIT_EXCEEDED";

const LANGUAGES: { value: Language; label: string; ext: string }[] = [
  { value: "cpp", label: "C++", ext: ".cpp" },
  { value: "java", label: "Java", ext: ".java" },
  { value: "python", label: "Python", ext: ".py" },
  { value: "javascript", label: "JavaScript", ext: ".js" },
  { value: "other", label: "Other", ext: "" },
];

const VERDICTS: { value: Verdict; label: string; color: string }[] = [
  { value: "", label: "No verdict / Unknown", color: "#6b7280" },
  { value: "OK", label: "✅ Accepted", color: "#34d399" },
  { value: "WRONG_ANSWER", label: "❌ Wrong Answer", color: "#f87171" },
  { value: "TIME_LIMIT_EXCEEDED", label: "⏰ Time Limit Exceeded", color: "#fb923c" },
  { value: "RUNTIME_ERROR", label: "💥 Runtime Error", color: "#c084fc" },
  { value: "COMPILATION_ERROR", label: "🔧 Compilation Error", color: "#fbbf24" },
  { value: "MEMORY_LIMIT_EXCEEDED", label: "🧠 Memory Limit Exceeded", color: "#22d3ee" },
];

const QUICK_CODE_EXAMPLES: { label: string; language: Language; verdict: Verdict; code: string; tags: string[] }[] = [
  {
    label: "TLE: O(N²) Brute Force",
    language: "cpp",
    verdict: "TIME_LIMIT_EXCEEDED",
    tags: ["arrays", "sorting"],
    code: `#include <bits/stdc++.h>
using namespace std;

// Find if any two numbers sum to target
bool hasPairWithSum(vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target)
                return true;
        }
    }
    return false;
}

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << (hasPairWithSum(arr, target) ? "YES" : "NO") << endl;
    return 0;
}`,
  },
  {
    label: "WA: Integer Overflow",
    language: "cpp",
    verdict: "WRONG_ANSWER",
    tags: ["math", "number theory"],
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i * i; // potential overflow for large n
    }
    cout << sum << endl;
    return 0;
}`,
  },
  {
    label: "RE: Array Out of Bounds",
    language: "cpp",
    verdict: "RUNTIME_ERROR",
    tags: ["arrays", "implementation"],
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i <= n; i++) // BUG: should be i < n
        cin >> arr[i];
    
    int maxVal = arr[0];
    for (int i = 1; i <= n; i++) // BUG: same issue
        maxVal = max(maxVal, arr[i]);
    
    cout << maxVal << endl;
    return 0;
}`,
  },
];

export function SolutionIntelligenceTab({ report }: SolutionIntelligenceTabProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("cpp");
  const [verdict, setVerdict] = useState<Verdict>("");
  const [problemId, setProblemId] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [problemTags, setProblemTags] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current && isStreaming) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [analysis, isStreaming]);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim() || isStreaming) return;
    setError(null);
    setAnalysis("");
    setIsStreaming(true);
    setHasAnalyzed(true);
    abortRef.current = new AbortController();

    // Extract Learning DNA trait names
    const dnaTraits = report.learning_dna?.dna_traits?.map(t => t.trait) ?? [];

    await streamSolutionAnalysis(
      {
        code: code.trim(),
        language,
        problem_id: problemId.trim(),
        problem_title: problemTitle.trim(),
        problem_tags: problemTags.split(",").map(t => t.trim()).filter(Boolean),
        verdict,
        username: report.profile.username,
        strong_topics: report.insights.strong_topics ?? [],
        weak_topics: report.insights.weak_topics ?? [],
        learning_dna_traits: dnaTraits,
        target_companies: [],
      },
      (chunk) => setAnalysis(prev => prev + chunk),
      (err) => { setError(err); setIsStreaming(false); },
      () => setIsStreaming(false),
      abortRef.current.signal
    );
  }, [code, language, verdict, problemId, problemTitle, problemTags, report, isStreaming]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCode(text);
      // Auto-detect language from extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "cpp" || ext === "cc" || ext === "cxx") setLanguage("cpp");
      else if (ext === "java") setLanguage("java");
      else if (ext === "py") setLanguage("python");
      else if (ext === "js" || ext === "ts") setLanguage("javascript");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleQuickExample = (ex: typeof QUICK_CODE_EXAMPLES[0]) => {
    setCode(ex.code);
    setLanguage(ex.language);
    setVerdict(ex.verdict);
    setProblemTags(ex.tags.join(", "));
    setAnalysis("");
    setHasAnalyzed(false);
  };

  const verdictInfo = VERDICTS.find(v => v.value === verdict);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="solution-tab"
    >
      {/* Header */}
      <div className="solution-header">
        <div className="solution-header__icon">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="solution-header__title">AI Solution Intelligence Engine</h2>
          <p className="solution-header__sub">
            Paste your code — get a 10-dimension AI code review powered by GPT-4o, personalized to your profile.
          </p>
        </div>
        <div className="solution-header__badge">
          <div className="solution-live-dot" />
          Profile-Aware
        </div>
      </div>

      <div className="solution-layout">
        {/* Left: Input Panel */}
        <div className="solution-input-panel">

          {/* Quick Examples */}
          <div className="solution-section">
            <div className="solution-section__label">
              <Zap size={13} /> Quick Examples
            </div>
            <div className="solution-examples">
              {QUICK_CODE_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  className="solution-example-btn"
                  onClick={() => handleQuickExample(ex)}
                  title={ex.label}
                >
                  <span className="solution-example-verdict" style={{ color: VERDICTS.find(v => v.value === ex.verdict)?.color }}>
                    {ex.verdict === "TIME_LIMIT_EXCEEDED" ? "⏰" : ex.verdict === "WRONG_ANSWER" ? "❌" : "💥"}
                  </span>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Context */}
          <div className="solution-section">
            <div className="solution-section__label"><FileCode size={13} /> Problem Context (Optional)</div>
            <div className="solution-problem-fields">
              <input
                className="solution-input"
                placeholder="Problem ID (e.g. 1234A)"
                value={problemId}
                onChange={e => setProblemId(e.target.value)}
              />
              <input
                className="solution-input"
                placeholder="Problem Title"
                value={problemTitle}
                onChange={e => setProblemTitle(e.target.value)}
              />
              <input
                className="solution-input"
                placeholder="Tags (e.g. dp, graphs, binary search)"
                value={problemTags}
                onChange={e => setProblemTags(e.target.value)}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="solution-controls-row">
            {/* Language selector */}
            <div className="solution-select-wrapper">
              <Code2 size={14} className="solution-select-icon" />
              <select
                className="solution-select"
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="solution-select-chevron" />
            </div>

            {/* Verdict selector */}
            <div className="solution-select-wrapper">
              <AlertTriangle size={14} className="solution-select-icon" style={{ color: verdictInfo?.color }} />
              <select
                className="solution-select"
                value={verdict}
                onChange={e => setVerdict(e.target.value as Verdict)}
                style={{ color: verdictInfo?.color || undefined }}
              >
                {VERDICTS.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="solution-select-chevron" />
            </div>
          </div>

          {/* Code Editor Area */}
          <div
            className={`solution-editor-wrapper ${isDragOver ? "solution-editor-wrapper--dragover" : ""}`}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="solution-editor-header">
              <span className="solution-editor-lang">{LANGUAGES.find(l => l.value === language)?.label}</span>
              <button
                className="solution-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload file"
              >
                <Upload size={13} /> Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".cpp,.cc,.java,.py,.js,.ts,.txt"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
              />
              {code && (
                <button className="solution-clear-btn" onClick={() => { setCode(""); setAnalysis(""); setHasAnalyzed(false); }}>
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            <textarea
              className="solution-editor"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`// Paste your ${LANGUAGES.find(l => l.value === language)?.label} code here...\n// Or drag and drop a .cpp / .java / .py file\n// Or click one of the Quick Examples above`}
              spellCheck={false}
            />

            {isDragOver && (
              <div className="solution-drop-overlay">
                <Upload size={32} />
                <span>Drop your code file here</span>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <div className="solution-action-row">
            <div className="solution-code-stats">
              {code ? (
                <>
                  <span>{code.split("\n").length} lines</span>
                  <span>·</span>
                  <span>{code.length} chars</span>
                </>
              ) : (
                <span className="solution-no-code">No code yet</span>
              )}
            </div>
            {isStreaming ? (
              <button className="solution-stop-btn" onClick={handleStop}>
                <RefreshCw size={15} className="animate-spin" /> Stop Analysis
              </button>
            ) : (
              <button
                className="solution-analyze-btn"
                disabled={!code.trim()}
                onClick={handleAnalyze}
              >
                <Cpu size={15} /> Analyze with AI
              </button>
            )}
          </div>

          {error && (
            <div className="solution-error">
              <AlertTriangle size={15} />
              <span>{error}</span>
              <button onClick={() => setError(null)}><X size={13} /></button>
            </div>
          )}
        </div>

        {/* Right: Analysis Output Panel */}
        <div className="solution-output-panel">
          <div className="solution-output-header">
            <div className="solution-output-header__left">
              <Sparkles size={16} style={{ color: "#c084fc" }} />
              <span>AI Analysis</span>
              {isStreaming && <div className="solution-streaming-badge">Generating...</div>}
            </div>
            {analysis && !isStreaming && (
              <div className="solution-done-badge">✓ Complete</div>
            )}
          </div>

          <div className="solution-output-body" ref={outputRef}>
            <AnimatePresence mode="wait">
              {!hasAnalyzed && !isStreaming ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="solution-empty-state"
                >
                  <div className="solution-empty-icon">
                    <Code2 size={40} />
                  </div>
                  <h3>Ready to analyze your code</h3>
                  <p>Paste your code on the left, choose a language and verdict, then click <strong>Analyze with AI</strong>.</p>
                  <div className="solution-feature-pills">
                    <span><Cpu size={12} /> Algorithm Detection</span>
                    <span><AlertTriangle size={12} /> Root Cause Analysis</span>
                    <span><Lightbulb size={12} /> Better Solutions</span>
                    <span><Building2 size={12} /> Company Mapping</span>
                    <span><BookOpen size={12} /> Learning Gaps</span>
                  </div>
                </motion.div>
              ) : isStreaming && !analysis ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="solution-loading-state"
                >
                  <div className="solution-loading-dots">
                    <span /><span /><span />
                  </div>
                  <p>GPT-4o is analyzing your code...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="solution-markdown"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = !props.inline;
                        return isBlock ? (
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={match?.[1] || "text"}
                            PreTag="div"
                            customStyle={{ borderRadius: "12px", fontSize: "0.8rem", margin: "1rem 0" }}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="solution-inline-code" {...props}>{children}</code>
                        );
                      },
                      table({ children }: any) {
                        return <div className="solution-table-wrapper"><table>{children}</table></div>;
                      },
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
                  {isStreaming && <span className="solution-cursor" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
