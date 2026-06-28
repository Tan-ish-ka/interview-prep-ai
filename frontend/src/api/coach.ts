
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachChatRequestPayload {
  message: string;
  profile: any;
  insights: any;
  recommendations: string[];
  interview_preparation: any;
  comparison?: any;
  platforms?: any;
  conversation: ConversationMessage[];
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function streamCoachChat(
  payload: CoachChatRequestPayload,
  onChunk: (text: string) => void,
  onError: (error: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE}/coach/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      let errText = `Request failed with status ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.detail) {
          errText = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        // ignore
      }
      throw new Error(errText);
    }

    if (!response.body) {
      throw new Error("No response body received from stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") {
            onDone();
            return;
          }

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
            console.error("Failed to parse SSE line:", trimmed, e);
          }
        }
      }
    }

    // Just in case stream ends without [DONE]
    onDone();
  } catch (err: any) {
    if (err.name === "AbortError") {
      // ignore aborts
      return;
    }
    onError(err.message || String(err));
  }
}
