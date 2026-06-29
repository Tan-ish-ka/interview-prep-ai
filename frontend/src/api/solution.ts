export interface SolutionAnalyzePayload {
  code: string;
  language: "cpp" | "java" | "python" | "javascript" | "other";
  problem_id?: string;
  problem_title?: string;
  problem_tags?: string[];
  verdict?: string;
  username?: string;
  strong_topics?: string[];
  weak_topics?: string[];
  learning_dna_traits?: string[];
  root_cause_summary?: string;
  target_companies?: string[];
}

import { API_BASE } from "./config";

export async function streamSolutionAnalysis(
  payload: SolutionAnalyzePayload,
  onChunk: (text: string) => void,
  onError: (err: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE}/solution/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      let msg = `Request failed (${response.status})`;
      try {
        const j = await response.json();
        if (typeof j.detail === "string") msg = j.detail;
      } catch { /* ignore */ }
      throw new Error(msg);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const t = line.trim();
        if (!t || !t.startsWith("data: ")) continue;
        const data = t.slice(6);
        if (data === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { onError(parsed.error); return; }
          if (parsed.text) onChunk(parsed.text);
        } catch { /* ignore malformed */ }
      }
    }
    onDone();
  } catch (err: any) {
    if (err.name === "AbortError") return;
    onError(err.message || String(err));
  }
}
