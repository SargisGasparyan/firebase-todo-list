import { NextRequest, NextResponse } from "next/server";
import { doc, writeBatch, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const USER_ID = "user-123";

function getTasksCollection() {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }
  return collection(db, "users", USER_ID, "tasks");
}

// POST - Update task order
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { taskIds, orders } = body;

    if (!Array.isArray(taskIds) || !Array.isArray(orders)) {
      return NextResponse.json(
        { error: "taskIds and orders must be arrays" },
        { status: 400 }
      );
    }

    if (taskIds.length !== orders.length) {
      return NextResponse.json(
        { error: "taskIds and orders arrays must have the same length" },
        { status: 400 }
      );
    }

    const tasksCollection = getTasksCollection();
    const batch = writeBatch(db);

    taskIds.forEach((taskId: string, index: number) => {
      const taskDoc = doc(tasksCollection, taskId);
      batch.update(taskDoc, { order: orders[index] });
    });

    await batch.commit();

    return NextResponse.json(
      { message: "Task order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task order:", error);
    return NextResponse.json(
      { error: "Failed to update task order" },
      { status: 500 }
    );
  }
}

