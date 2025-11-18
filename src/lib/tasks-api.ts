/**
 * Create a new task
 */
export async function createTask(title: string): Promise<string> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create task");
  }

  const data = await response.json();
  return data.id;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete task");
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "done"
): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "status", value: status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task status");
  }
}

/**
 * Update task title
 */
export async function updateTaskTitle(
  taskId: string,
  title: string
): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "title", value: title }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task title");
  }
}

/**
 * Toggle task importance
 */
export async function toggleTaskImportance(
  taskId: string,
  important: boolean
): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "important", value: important }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to toggle task importance");
  }
}

/**
 * Update task order
 */
export async function updateTaskOrder(
  taskIds: string[],
  orders: number[]
): Promise<void> {
  const response = await fetch("/api/tasks/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskIds, orders }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task order");
  }
}
