const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export interface TestConnectionResult {
  success: boolean;
  message: string;
  provider: string;
}

export async function testProviderConnection(
  provider: string,
  apiKey: string
): Promise<TestConnectionResult> {
  const response = await fetch(`${API_BASE}/ai/test-connection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, api_key: apiKey }),
  });

  if (!response.ok) {
    return { success: false, message: `Server error (${response.status})`, provider };
  }

  return response.json();
}
