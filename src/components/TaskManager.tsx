"use client";

import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types/task";
import { convertFirestoreTimestamp } from "@/lib/helpers";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";
import FilterButtons, { FilterType } from "./FilterButtons";
import TaskListSkeleton from "./skeleton/TaskListSkeleton";

const USER_ID = "user-123";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !db) {
      return;
    }

    const tasksCollection = collection(db, "users", USER_ID, "tasks");
    const q = query(tasksCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const tasksData: Task[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Convert Firestore Timestamp to milliseconds
            const createdAt = convertFirestoreTimestamp(data.createdAt);

            return {
              id: doc.id,
              ...data,
              createdAt,
            } as Task;
          });

          setTasks(tasksData);
          setIsLoading(false);
          setError(null);
        } catch (err) {
          console.error("Error processing tasks:", err);
          setError("Failed to load tasks");
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Error subscribing to tasks:", err);
        setError("Failed to connect to database");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleTaskAdded = () => {
    // Tasks will update automatically via onSnapshot
  };

  const handleTaskUpdated = () => {
    // Tasks will update automatically via onSnapshot
  };

  const handleTaskDeleted = () => {
    // Tasks will update automatically via onSnapshot
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((t) => t.status === "todo").length,
    completed: tasks.filter((t) => t.status === "done").length,
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Task Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your tasks efficiently
        </p>
      </div>

      <AddTaskForm onTaskAdded={handleTaskAdded} />

      <FilterButtons
        currentFilter={filter}
        onFilterChange={setFilter}
        taskCounts={taskCounts}
      />

      {isLoading ? (
        <TaskListSkeleton count={5} />
      ) : (
        <TaskList
          tasks={tasks}
          filter={filter}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
}
