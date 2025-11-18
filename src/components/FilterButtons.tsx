"use client";

export type FilterType = "all" | "active" | "completed";

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function FilterButtons({
  currentFilter,
  onFilterChange,
  taskCounts,
}: FilterButtonsProps) {
  const filters: { type: FilterType; label: string; count: number }[] = [
    { type: "all", label: "All", count: taskCounts.all },
    { type: "active", label: "Active", count: taskCounts.active },
    { type: "completed", label: "Completed", count: taskCounts.completed },
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentFilter === filter.type
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
}

