"use client";

import { useGuestServices } from "@/store/useGuestServices";

interface ActivityLogProps {
  maxItems?: number;
}

export function ActivityLog({ maxItems = 8 }: ActivityLogProps) {
  const { activityLog } = useGuestServices();

  const recentActivity = activityLog.slice(0, maxItems);

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

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Activity Feed</h3>
      
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {recentActivity.length === 0 ? (
          <div className="activity-item text-center py-8">
            <p className="text-secondary text-sm">No activity yet</p>
          </div>
        ) : (
          recentActivity.map((item, index) => (
            <div key={index} className="activity-item">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="text-xs text-secondary">{item.staffName}</p>
                </div>
                <span className="text-xs text-secondary whitespace-nowrap">
                  {formatTime(item.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
