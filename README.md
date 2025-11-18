# Firebase Task Manager

A personal task manager application built with Next.js, Firebase Firestore, and TypeScript. This application allows you to create, manage, and organize your tasks with a clean, responsive interface.

## Live Demo

[Link to live demo will be added after deployment to Vercel]

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

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Firebase project with Firestore enabled
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd firebase-tasks
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   You can find these values in your Firebase project settings under "Your apps" → Web app config.

4. **Set up Firestore**

   - Go to Firebase Console → Firestore Database
   - Create a database in test mode (or production mode with appropriate security rules)
   - The app will automatically create the collection structure: `users/user-123/tasks`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

The following environment variables are required in `.env.local`:

| Variable                                   | Description                  |
| ------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key             |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              |

**Note:** All variables are prefixed with `NEXT_PUBLIC_` to make them available in the browser.

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

## Technical Decisions

### 1. **Real-time Updates with Firestore**

- Used `onSnapshot` for real-time synchronization
- Tasks update automatically across all clients without manual refresh

### 2. **Component Architecture**

- Separated concerns into focused components
- Used client components (`"use client"`) for interactive features
- Server components for static content

### 3. **Data Modeling**

- Tasks stored in subcollection: `users/{userId}/tasks`
- Each task document contains: `id`, `title`, `status`, `createdAt`, `important`, `order`
- Used hardcoded user ID (`user-123`) as per requirements (no authentication)

### 4. **TypeScript Usage**

- Strict typing throughout the application
- Defined interfaces for all data structures
- No `any` types used

### 5. **Error Handling**

- Try-catch blocks in all async operations
- User-friendly error messages
- Loading states for better UX

### 6. **Responsive Design**

- Mobile-first approach with Tailwind CSS
- Breakpoints for sm, md, lg screens
- Touch-friendly interactions on mobile

### 7. **Drag and Drop**

- HTML5 Drag and Drop API (no external libraries)
- Visual feedback during dragging
- Batch updates for efficient reordering

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

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The app will be automatically deployed and available at a Vercel URL.

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

## License

This project is created for assessment purposes.
