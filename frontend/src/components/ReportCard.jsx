import { useState } from "react";
import { MapPin, Clock, Sparkles, Loader2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CATEGORY_META } from "../utils/categoryStyles";
import { generateSummary } from "../services/api";

export default function ReportCard({ report }) {
  const [summary, setSummary] = useState(report.aiSummary || null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const meta = CATEGORY_META[report.category] || CATEGORY_META.Other;
  const Icon = meta.icon;

  async function handleGenerateSummary() {
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const { summary: text } = await generateSummary(report.id);
      setSummary(text);
    } catch (err) {
      setSummaryError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  }

  let timeAgo = "";
  try {
    timeAgo = formatDistanceToNow(new Date(report.timestamp), { addSuffix: true });
  } catch {
    timeAgo = "";
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={`Photo submitted with ${report.category} report`}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${meta.bg} ${meta.color} ${meta.ring}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {report.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <User className="h-4 w-4 text-gray-500" />
          {report.name}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-gray-500" />
          {report.location}
        </div>

        {report.description && (
          <p className="text-sm leading-relaxed text-gray-400">{report.description}</p>
        )}

        <div className="mt-auto pt-2">
          {summary ? (
            <div className="rounded-lg border border-accent-600/30 bg-accent-600/10 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent-400">
                <Sparkles className="h-3.5 w-3.5" />
                AI Summary
              </p>
              <p className="text-sm text-gray-200">{summary}</p>
            </div>
          ) : (
            <button
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
              className="btn-secondary w-full text-sm"
            >
              {loadingSummary ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </>
              )}
            </button>
          )}
          {summaryError && (
            <p className="mt-2 text-xs text-accent-400">{summaryError}</p>
          )}
        </div>
      </div>
    </article>
  );
}
