import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
