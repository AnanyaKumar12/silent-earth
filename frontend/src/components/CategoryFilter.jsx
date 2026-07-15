export default function CategoryFilter({ categories, active, onChange }) {
  const options = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            active === option
              ? "border-accent-500 bg-accent-600/20 text-accent-400"
              : "border-base-600 bg-base-800 text-gray-400 hover:border-base-500 hover:text-gray-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
