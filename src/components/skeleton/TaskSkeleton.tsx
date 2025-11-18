interface TaskSkeletonProps {
  width?: string;
}

export default function TaskSkeleton({ width = "75%" }: TaskSkeletonProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Checkbox skeleton */}
      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0"></div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        {/* Title skeleton */}
        <div
          className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"
          style={{ width }}
        ></div>
        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

