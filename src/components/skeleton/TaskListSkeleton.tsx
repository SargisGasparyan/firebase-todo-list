import TaskSkeleton from "./TaskSkeleton";

interface TaskListSkeletonProps {
  count?: number;
}

// Predefined widths for variety
const widths = ["75%", "85%", "65%", "90%", "70%", "80%"];

export default function TaskListSkeleton({ count = 3 }: TaskListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TaskSkeleton key={index} width={widths[index % widths.length]} />
      ))}
    </div>
  );
}
