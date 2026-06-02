import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="glass-card state-panel state-panel--error" role="alert">
      <AlertCircle size={36} className="state-panel__icon-error" />
      <h2>Could not generate report</h2>
      <p>{message}</p>
    </div>
  );
}
