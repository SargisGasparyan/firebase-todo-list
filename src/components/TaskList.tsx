"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { FilterType } from "./FilterButtons";
import { updateTaskOrder } from "@/lib/tasks-api";

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskList({
  tasks,
  filter,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return task.status === "todo";
    if (filter === "completed") return task.status === "done";
    return true;
  });

  // Sort by order if available, otherwise by createdAt
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    if (draggedTaskId && draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();

    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const draggedIndex = sortedTasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = sortedTasks.findIndex((t) => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    // Create new order array
    const newTasks = [...sortedTasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    // Update orders
    const taskIds = newTasks.map((t) => t.id);
    const orders = newTasks.map((_, index) => index);

    try {
      await updateTaskOrder(taskIds, orders);
      onTaskUpdated();
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">
          {filter === "all"
            ? "No tasks yet. Add one above!"
            : filter === "active"
            ? "No active tasks. Great job!"
            : "No completed tasks yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" onDragEnd={handleDragEnd}>
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedTaskId === task.id}
          dragOver={dragOverTaskId === task.id}
        />
      ))}
    </div>
  );
}
