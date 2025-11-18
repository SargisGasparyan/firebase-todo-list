/**
 * Format timestamp to readable date and time string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted string like "Jan 15, 2024, 3:45 PM"
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format timestamp to relative time string (e.g., "2 hours ago")
 * @param timestamp - Timestamp in milliseconds
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute ago
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than an hour ago
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  // Less than a day ago
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  // Less than a week ago
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // More than a week ago - show formatted date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Convert Firestore Timestamp to milliseconds
 * @param timestamp - Firestore Timestamp object or number
 * @returns Timestamp in milliseconds
 */
export function convertFirestoreTimestamp(
  timestamp:
    | { toMillis?: () => number; seconds?: number; nanoseconds?: number }
    | number
    | undefined
    | null
): number {
  if (!timestamp) {
    // Fallback to current time if timestamp is missing
    return Date.now();
  }

  if (typeof timestamp === "number") {
    return timestamp;
  }

  // Handle Firestore Timestamp object
  if (typeof timestamp === "object") {
    if (timestamp.toMillis && typeof timestamp.toMillis === "function") {
      return timestamp.toMillis();
    }
    if (typeof timestamp.seconds === "number") {
      return timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
    }
  }

  // Fallback to current time
  return Date.now();
}
