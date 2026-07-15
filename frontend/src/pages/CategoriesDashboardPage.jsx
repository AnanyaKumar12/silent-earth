import { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/categoryStyles";
import { getCategoryCounts } from "../services/api";
import CategoryCard from "../components/CategoryCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function CategoriesDashboardPage() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getCategoryCounts();
      setCounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="mt-2 text-gray-400">
          Browse reports by type to quickly find what matters most right now.
        </p>
      </div>

      {loading && <Loader label="Loading categories..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} category={category} count={counts?.[category]} />
          ))}
        </div>
      )}
    </div>
  );
}
