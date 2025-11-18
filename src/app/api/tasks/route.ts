import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TaskStatus } from "@/types/task";
import { convertFirestoreTimestamp } from "@/lib/helpers";

const USER_ID = "user-123";

function getTasksCollection() {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }
  return collection(db, "users", USER_ID, "tasks");
}

// GET - Get all tasks
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const tasksCollection = getTasksCollection();
    const q = query(tasksCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = convertFirestoreTimestamp(data.createdAt);

      return {
        id: doc.id,
        title: data.title,
        status: data.status,
        createdAt,
        important: data.important || false,
        order: data.order,
      };
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error getting tasks:", error);
    return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 });
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const tasksCollection = getTasksCollection();
    const taskData = {
      title: title.trim(),
      status: "todo" as TaskStatus,
      createdAt: Timestamp.now(),
      important: false,
    };

    const docRef = await addDoc(tasksCollection, taskData);

    return NextResponse.json(
      { id: docRef.id, message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
