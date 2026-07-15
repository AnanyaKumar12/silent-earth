import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CATEGORY_META } from "../utils/categoryStyles";

export default function CategoryCard({ category, count }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const Icon = meta.icon;

  return (
    <Link
      to={`/feed/${encodeURIComponent(category)}`}
      className="card group flex flex-col justify-between p-6 transition hover:border-base-600 hover:bg-base-800"
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg}`}>
          <Icon className={`h-6 w-6 ${meta.color}`} />
        </span>
        <ChevronRight className="h-5 w-5 text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-400" />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-400">{category}</p>
        <p className="mt-1 text-3xl font-bold text-white">{count ?? 0}</p>
        <p className="mt-1 text-xs text-gray-500">reports so far</p>
      </div>
    </Link>
  );
}
