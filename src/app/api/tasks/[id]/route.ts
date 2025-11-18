import { NextRequest, NextResponse } from "next/server";
import { deleteDoc, updateDoc, doc, collection } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { TaskStatus } from "@/types/task";

const USER_ID = "user-123";

function getTasksCollection() {
  const db = getDb();
  return collection(db, "users", USER_ID, "tasks");
}

// DELETE - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const tasksCollection = getTasksCollection();
    const taskDoc = doc(tasksCollection, id);
    await deleteDoc(taskDoc);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to delete task",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// PUT - Update a task (status, title, or important)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, value } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required (status, title, or important)" },
        { status: 400 }
      );
    }

    const tasksCollection = getTasksCollection();
    const taskDoc = doc(tasksCollection, id);

    switch (action) {
      case "status":
        if (!value || (value !== "todo" && value !== "done")) {
          return NextResponse.json(
            { error: "Invalid status value" },
            { status: 400 }
          );
        }
        await updateDoc(taskDoc, { status: value as TaskStatus });
        break;

      case "title":
        if (!value || typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            { error: "Title is required and must be a non-empty string" },
            { status: 400 }
          );
        }
        await updateDoc(taskDoc, { title: value.trim() });
        break;

      case "important":
        if (typeof value !== "boolean") {
          return NextResponse.json(
            { error: "Important must be a boolean" },
            { status: 400 }
          );
        }
        await updateDoc(taskDoc, { important: value });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: status, title, or important" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to update task",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
