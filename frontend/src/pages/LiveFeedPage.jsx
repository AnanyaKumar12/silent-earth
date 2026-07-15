import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Inbox } from "lucide-react";
import { CATEGORIES } from "../utils/categoryStyles";
import { getReports } from "../services/api";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ReportCard from "../components/ReportCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function LiveFeedPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeCategory = categoryParam || "All";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReports({ category: activeCategory, search });
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    load();
  }, [load]);

  function handleCategoryChange(category) {
    if (category === "All") navigate("/feed");
    else navigate(`/feed/${encodeURIComponent(category)}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Live Feed</h1>
        <p className="mt-2 text-gray-400">
          Real-time community reports, newest first.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <div className="mb-8">
        <CategoryFilter categories={CATEGORIES} active={activeCategory} onChange={handleCategoryChange} />
      </div>

      {loading && <Loader label="Loading reports..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && reports.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-gray-500">
          <Inbox className="h-10 w-10" />
          <p>No reports match your filters yet.</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
