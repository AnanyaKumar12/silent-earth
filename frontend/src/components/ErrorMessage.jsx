import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-accent-600/40 bg-accent-600/10 px-6 py-8 text-center">
      <AlertTriangle className="h-8 w-8 text-accent-400" />
      <p className="text-sm text-gray-200">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-1 text-sm">
          Try again
        </button>
      )}
    </div>
  );
}
