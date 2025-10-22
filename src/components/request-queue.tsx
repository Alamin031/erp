"use client";

import { useGuestServices } from "@/store/useGuestServices";

const priorityColors: Record<string, { bg: string; icon: string }> = {
  Urgent: { bg: "bg-red-50", icon: "🔴" },
  High: { bg: "bg-orange-50", icon: "🟠" },
  Normal: { bg: "bg-yellow-50", icon: "🟡" },
  Low: { bg: "bg-green-50", icon: "🟢" },
};

const serviceIcons: Record<string, string> = {
  "Room Service": "🍽️",
  "Housekeeping Request": "🧹",
  "Maintenance": "🔧",
  "Wake-up Call": "⏰",
  "Laundry": "🧺",
  "Other": "❓",
};

interface RequestQueueProps {
  onRequestClick: (requestId: string) => void;
}

export function RequestQueue({ onRequestClick }: RequestQueueProps) {
  const { getQueue, setSelectedRequestId } = useGuestServices();
  const queue = getQueue();

  const handleClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    onRequestClick(requestId);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-foreground">Request Queue</h2>
      
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
        {queue.length === 0 ? (
          <div className="p-6 text-center bg-background border border-dashed border-border rounded-lg">
            <p className="text-secondary text-sm">No pending requests</p>
          </div>
        ) : (
          queue.map((request) => {
            const colors = priorityColors[request.priority];
            const icon = serviceIcons[request.serviceType] || "📋";

            return (
              <button
                key={request.id}
                onClick={() => handleClick(request.id)}
                className={`p-3 rounded-lg border border-border cursor-pointer transition-all hover:border-primary hover:shadow-md ${colors.bg}`}
                title={request.notes}
              >
                <div className="flex items-start gap-2">
                  <div className="text-lg">{icon}</div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">{request.id}</span>
                      <span className="text-xs px-2 py-1 bg-white rounded font-medium">{colors.icon} {request.priority}</span>
                    </div>
                    <p className="text-xs text-secondary">
                      {request.guestName} - Room {request.roomNumber}
                    </p>
                    <p className="text-xs text-secondary mt-1">{request.serviceType}</p>
                  </div>
                </div>
                {request.assignedStaffIds.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/50">
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      ✓ Assigned
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
