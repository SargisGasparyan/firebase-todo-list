"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/types/task";
import {
  deleteTask,
  updateTaskStatus,
  updateTaskTitle,
  toggleTaskImportance,
} from "@/lib/tasks-api";
import { formatDate } from "@/lib/helpers";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragOver?: (e: React.DragEvent, taskId: string) => void;
  onDrop?: (e: React.DragEvent, taskId: string) => void;
  isDragging?: boolean;
  dragOver?: boolean;
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  dragOver = false,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, task.status === "todo" ? "done" : "todo");
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsUpdating(true);
    try {
      await deleteTask(task.id);
      onTaskDeleted();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setEditTitle(task.title);
      setIsEditing(false);
      return;
    }

    if (editTitle.trim() === task.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await updateTaskTitle(task.id, editTitle);
      onTaskUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task title:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleToggleImportant = async () => {
    setIsUpdating(true);
    try {
      await toggleTaskImportance(task.id, !task.important);
      onTaskUpdated();
    } catch (error) {
      console.error("Error toggling importance:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e, task.id);
      }}
      onDrop={(e) => onDrop?.(e, task.id)}
      className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all cursor-move ${
        isUpdating ? "opacity-50" : ""
      } ${task.status === "done" ? "opacity-75" : ""} ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
    >
      <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={handleToggleStatus}
        disabled={isUpdating}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      ) : (
        <div className="flex-1" onDoubleClick={handleEdit}>
          <div
            className={`${
              task.status === "done"
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.important && (
              <span className="mr-2 text-yellow-500" title="Important">
                ⭐
              </span>
            )}
            {task.title}
          </div>
          {task.createdAt && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Created {formatDate(task.createdAt)}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleImportant}
          disabled={isUpdating}
          className={`p-2 rounded transition-colors ${
            task.important
              ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              : "text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          title={task.important ? "Remove importance" : "Mark as important"}
        >
          ⭐
        </button>

        {!isEditing && (
          <button
            onClick={handleEdit}
            disabled={isUpdating}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Edit task"
          >
            ✏️
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
