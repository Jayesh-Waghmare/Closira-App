export function timeAgo(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

export function formatDueTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86400000);
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date < todayStart) {
    if (date >= yesterdayStart) return "Yesterday";
    return "Overdue";
  }
  if (date >= tomorrowStart) {
    return `Tomorrow at ${timeStr}`;
  }
  return `Today at ${timeStr}`;
}

export function isOverdue(isoString: string): boolean {
  return new Date(isoString) < new Date();
}
