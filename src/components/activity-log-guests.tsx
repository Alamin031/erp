"use client";

import { useGuests } from "@/store/useGuests";

interface ActivityLogGuestsProps {
  maxItems?: number;
  guestId?: string;
}

export function ActivityLogGuests({ maxItems = 10, guestId }: ActivityLogGuestsProps) {
  const { guests } = useGuests();

  const getActivityLog = () => {
    if (guestId) {
      const guest = guests.find((g) => g.id === guestId);
      return (
        guest?.activityLog.map((log) => ({
          timestamp: log.timestamp,
          description: log.description,
          guestName: `${guest?.firstName} ${guest?.lastName}`,
          type: log.type,
        })) || []
      );
    }

    const allActivities: Array<{ timestamp: string; description: string; guestName: string; type: string }> = [];
    guests.forEach((g) => {
      g.activityLog.forEach((log) => {
        allActivities.push({
          timestamp: log.timestamp,
          description: log.description,
          guestName: `${g.firstName} ${g.lastName}`,
          type: log.type,
        });
      });
    });

    return allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems);
  };

  const activities = getActivityLog();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      "check-in": "✓",
      "check-out": "✗",
      "service-request": "📋",
      "note": "📝",
      "edit": "✎",
      "message": "💬",
    };
    return icons[type] || "•";
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {guestId ? "Guest Activity" : "Recent Activity"}
      </h3>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="activity-item text-center py-8">
            <p className="text-secondary text-sm">No activity yet</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-2 flex-1">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-secondary">{activity.guestName}</p>
                  </div>
                </div>
                <span className="text-xs text-secondary whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
