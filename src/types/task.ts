export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number; // timestamp in milliseconds
  important?: boolean; // bonus feature
  order?: number; // for drag to reorder (bonus feature)
}

