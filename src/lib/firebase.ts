// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const isConfigValid = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Lazy initialization for serverless environments
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function initializeFirebase(): { app: FirebaseApp; db: Firestore } {
  if (!isConfigValid()) {
    throw new Error(
      "Firebase configuration is incomplete. Please check your environment variables."
    );
  }

  // Return cached instances if already initialized
  if (app && db) {
    return { app, db };
  }

  try {
    // Get or initialize app
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    // Initialize Firestore
    db = getFirestore(app);

    return { app, db };
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}

// Initialize immediately for client-side (browser)
if (typeof window !== "undefined") {
  try {
    if (isConfigValid()) {
      const { app: clientApp, db: clientDb } = initializeFirebase();
      app = clientApp;
      db = clientDb;
    }
  } catch (error) {
    console.error("Error initializing Firebase on client:", error);
  }
}

// Getter function for server-side lazy initialization
// This ensures Firebase is initialized on-demand in serverless functions
function getDb(): Firestore {
  if (db) {
    return db;
  }
  const { db: initializedDb } = initializeFirebase();
  return initializedDb;
}

// Export: For client-side, db is already initialized
// For server-side API routes, use getDb() for lazy initialization
export { getDb };
export { db };
export default app;
