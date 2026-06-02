import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="glass-card state-panel" role="status" aria-live="polite">
      <Loader2 className="state-panel__spinner" size={36} />
      <h2>Building your report</h2>
      <p>Fetching profile data and running analytics…</p>
    </div>
  );
}
