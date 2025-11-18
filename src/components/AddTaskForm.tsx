"use client";

import { useState, FormEvent } from "react";
import { createTask } from "@/lib/tasks-api";

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createTask(title);
      setTitle("");
      onTaskAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task. Please try again.";
      setError(errorMessage);
      console.error("Error creating task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}
