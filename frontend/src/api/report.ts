import type { ReportResponse } from "../types/report";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function fetchReport(profileUrl: string): Promise<ReportResponse> {
  const params = new URLSearchParams({ url: profileUrl.trim() });
  const response = await fetch(`${API_BASE}/report?${params}`);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string | unknown[] };
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((item) => JSON.stringify(item)).join("; ");
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<ReportResponse>;
}
