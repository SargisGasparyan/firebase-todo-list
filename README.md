# Firebase Task Manager

A personal task manager application built with Next.js, Firebase Firestore, and TypeScript. This application allows you to create, manage, and organize your tasks with a clean, responsive interface.

## Live Demo

🌐 **Live Application:** [https://firebase-todo-list-22zvk9pfa-sargis-projects-6d981cb8.vercel.app/](https://firebase-todo-list-22zvk9pfa-sargis-projects-6d981cb8.vercel.app/)

📦 **GitHub Repository:** [https://github.com/SargisGasparyan/firebase-todo-list](https://github.com/SargisGasparyan/firebase-todo-list)

The application is deployed on Vercel and uses Firebase Firestore for data persistence.

## Features

### Core Requirements ✅

- **Create and delete tasks** - Add new tasks and remove completed ones
- **Task properties** - Each task has:
  - Title
  - Status (todo/done)
  - Created timestamp
- **Firestore persistence** - All tasks are stored in Firebase Firestore
- **Filter views** - Filter tasks by:
  - All tasks
  - Active (todo) tasks only
  - Completed (done) tasks only
- **Responsive design** - Works seamlessly on both mobile and desktop devices

### Bonus Features ✅

- **Edit task titles** - Double-click or use the edit button to modify task titles
- **Drag to reorder** - Drag and drop tasks to change their order
- **Mark as important** - Star tasks to mark them as important

## Tech Stack

- **Next.js 16** (App Router) - React framework for production
- **Firebase Firestore** - NoSQL database for task persistence
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework for styling

## Installation Instructions

### Prerequisites

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Firebase account** with a project created
- **Firestore Database** enabled in your Firebase project

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd firebase-tasks
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Click on the **Web app** icon (`</>`) or create a new web app
6. Copy the Firebase configuration object

#### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to find these values:**

- In Firebase Console → Project Settings → Your apps → Web app config
- They are displayed in the `firebaseConfig` object

#### 5. Set Up Firestore Database

1. Go to Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Production mode** with security rules
4. Select a location for your database
5. The app will automatically create the collection structure: `users/user-123/tasks`

#### 6. Run the Development Server

```bash
npm run dev
```

#### 7. Open the Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables (Firebase Config)

### Required Variables

The following environment variables are **required** for the application to work. All variables must be prefixed with `NEXT_PUBLIC_` to be accessible in both client and server-side code.

| Variable                                   | Description                         | Example                           |
| ------------------------------------------ | ----------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key for authentication | `AIzaSyC...`                      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase authentication domain      | `your-project.firebaseapp.com`    |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Your Firebase project ID            | `your-project-id`                 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Cloud Storage bucket URL   | `your-project.appspot.com`        |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID  | `123456789012`                    |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID                     | `1:123456789012:web:abcdef123456` |

### Local Development

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Vercel Deployment

When deploying to Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable with the exact name (including `NEXT_PUBLIC_` prefix)
3. Select environments: **Production** and **Preview**
4. Click **Save**
5. **Redeploy** your application

**Important:**

- All variables must start with `NEXT_PUBLIC_` to be available in both browser and server
- After adding variables in Vercel, you must redeploy for changes to take effect
- Missing variables will cause initialization errors

## Project Structure

```
firebase-tasks/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── TaskManager.tsx  # Main task manager component
│   │   ├── TaskList.tsx     # Task list component
│   │   ├── TaskItem.tsx     # Individual task component
│   │   ├── AddTaskForm.tsx  # Form to add new tasks
│   │   └── FilterButtons.tsx # Filter buttons component
│   ├── lib/                 # Utility functions
│   │   ├── firebase.ts      # Firebase initialization
│   │   └── tasks.ts         # Firestore CRUD operations
│   └── types/               # TypeScript type definitions
│       └── task.ts          # Task type definitions
├── .env.local               # Environment variables (not in git)
├── package.json
└── README.md
```

## Technical Decisions & Solutions

### 1. **Real-time Updates with Firestore**

- **Solution:** Used `onSnapshot` listener for real-time synchronization
- **Benefit:** Tasks update automatically across all clients without manual refresh
- **Implementation:** Client-side component subscribes to Firestore changes and updates UI reactively

### 2. **Serverless Architecture (Vercel)**

- **Challenge:** Firebase Client SDK can hang when initialized at module load in serverless functions
- **Solution:** Implemented lazy initialization pattern for Firebase
  - Client-side: Firebase initializes immediately on page load
  - Server-side: Firebase initializes on-demand when API routes are called
  - Uses `getDb()` function for lazy initialization in API routes
- **Benefit:** Prevents infinite pending requests and ensures reliable serverless execution
- **Configuration:** Added `serverExternalPackages: ["firebase"]` in `next.config.ts` for proper bundling

### 3. **Component Architecture**

- **Pattern:** Separated concerns into focused, reusable components
- **Client Components:** Used `"use client"` directive for interactive features (TaskManager, TaskList, TaskItem)
- **Server Components:** Used for static content and layouts
- **Structure:**
  - `TaskManager` - Main container with state management
  - `TaskList` - List rendering and drag-drop logic
  - `TaskItem` - Individual task UI and interactions
  - `AddTaskForm` - Form handling and validation

### 4. **Data Modeling**

- **Structure:** Tasks stored in subcollection: `users/{userId}/tasks`
- **Schema:** Each task document contains:
  - `id` - Document ID (auto-generated)
  - `title` - Task title (string)
  - `status` - Task status ("todo" | "done")
  - `createdAt` - Firestore Timestamp
  - `important` - Boolean flag for important tasks
  - `order` - Number for drag-drop ordering
- **User Management:** Hardcoded user ID (`user-123`) as per requirements (no authentication)

### 5. **API Routes & Error Handling**

- **Pattern:** RESTful API routes using Next.js App Router
- **Routes:**
  - `GET /api/tasks` - Fetch all tasks
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/[id]` - Update task (status, title, importance)
  - `DELETE /api/tasks/[id]` - Delete task
  - `POST /api/tasks/order` - Batch update task order
- **Error Handling:**
  - Comprehensive try-catch blocks in all async operations
  - Detailed error messages with stack traces (development only)
  - User-friendly error messages in UI
  - Proper HTTP status codes (400, 500, etc.)

### 6. **TypeScript Usage**

- **Approach:** Strict typing throughout the application
- **Benefits:**
  - Type safety at compile time
  - Better IDE autocomplete and IntelliSense
  - Easier refactoring and maintenance
- **Standards:** Defined interfaces for all data structures, no `any` types used

### 7. **Responsive Design**

- **Framework:** Tailwind CSS utility-first approach
- **Strategy:** Mobile-first responsive design
- **Breakpoints:** Optimized for sm, md, lg screens
- **UX:** Touch-friendly interactions on mobile devices

### 8. **Drag and Drop**

- **Implementation:** HTML5 Drag and Drop API (no external libraries)
- **Features:**
  - Visual feedback during dragging
  - Batch updates for efficient reordering
  - Persists order to Firestore via batch write

### 9. **Content Security Policy (CSP)**

- **Challenge:** Firebase SDK requires `unsafe-eval` for some functionality
- **Solution:** Configured CSP headers in `next.config.ts`
- **Configuration:** Allows Firebase domains and WebSocket connections while maintaining security

### 10. **Runtime Configuration**

- **API Routes:** Explicitly set to use Node.js runtime (`export const runtime = "nodejs"`)
- **Reason:** Ensures Firebase SDK works correctly in Vercel serverless functions
- **Compatibility:** Prevents edge runtime issues with Firebase initialization

## Usage

1. **Adding a Task**

   - Type your task in the input field
   - Click "Add" or press Enter

2. **Completing a Task**

   - Click the checkbox next to a task
   - Task will be marked as done (strikethrough)

3. **Editing a Task**

   - Double-click the task title, or
   - Click the edit (✏️) button
   - Press Enter to save, Escape to cancel

4. **Deleting a Task**

   - Click the delete (🗑️) button
   - Confirm deletion in the dialog

5. **Marking as Important**

   - Click the star (⭐) button
   - Important tasks show a star icon

6. **Reordering Tasks**

   - Drag a task by clicking and holding
   - Drop it in the desired position
   - Order is automatically saved

7. **Filtering Tasks**
   - Click "All", "Active", or "Completed" buttons
   - View task counts for each filter

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import repository in Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import your GitHub repository

3. **Configure environment variables**

   - In Vercel project settings, go to **Environment Variables**
   - Add all 6 Firebase variables (see [Environment Variables](#environment-variables-firebase-config) section)
   - Select **Production** and **Preview** environments
   - Click **Save**

4. **Deploy**

   - Vercel will automatically detect Next.js and deploy
   - Or manually trigger deployment from the dashboard

5. **Verify deployment**
   - Check the deployment logs for any errors
   - Test the live application
   - Verify Firebase connection is working

**Note:** After adding environment variables, you must redeploy for them to take effect.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Development Time

⏱️ **Time Spent:** 4 hours

This project was developed from scratch, including:

- Setting up Next.js 16 with App Router
- Firebase Firestore integration
- Real-time data synchronization
- Serverless deployment configuration
- UI/UX implementation with Tailwind CSS
- Error handling and edge case management

## License

This project is created for assessment purposes.
