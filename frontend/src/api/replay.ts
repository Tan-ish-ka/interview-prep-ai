export interface TimelineEvent {
  time_minutes: number;
  event: string;
  problem: string;
  description: string;
}

export interface ContestReplayContext {
  contest_id: string;
  problems_attempted: number;
  problems_solved: number;
  total_penalty_time: number;
  time_wasted_minutes: number;
  timeline: TimelineEvent[];
}

export interface ReplayAnalysisRequest {
  username: string;
  contest: ContestReplayContext;
}

export interface ReplaySimulateRequest extends ReplayAnalysisRequest {
  what_if_scenario: string;
}

export interface ReplayChatRequest extends ReplayAnalysisRequest {
  message: string;
  conversation: { role: string; content: string }[];
}

import { API_BASE } from "./config";

// Stream the analysis (Contest Coach, Insights Dashboard, Decision Reviews)
export async function streamReplayAnalysis(
  req: ReplayAnalysisRequest,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/replay/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    if (!reader) throw new Error("No response body");

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              done = true;
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  onError(parsed.error);
                  return;
                }
                if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (e) {
                // Ignore incomplete JSON chunks from split boundaries
              }
            }
          }
        }
      }
    }
    onDone();
  } catch (err: any) {
    onError(err.message);
  }
}

// Stream What-If simulation
export async function streamReplaySimulation(
  req: ReplaySimulateRequest,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/replay/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    if (!reader) throw new Error("No response body");

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              done = true;
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  onError(parsed.error);
                  return;
                }
                if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (e) {
              }
            }
          }
        }
      }
    }
    onDone();
  } catch (err: any) {
    onError(err.message);
  }
}

// Stream Contest Chat
export async function streamReplayChat(
  req: ReplayChatRequest,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/replay/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    if (!reader) throw new Error("No response body");

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              done = true;
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  onError(parsed.error);
                  return;
                }
                if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (e) {
              }
            }
          }
        }
      }
    }
    onDone();
  } catch (err: any) {
    onError(err.message);
  }
}
