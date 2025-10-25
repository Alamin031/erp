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
      <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>Request Queue</h2>
      
      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto" style={{ padding: "2px" }}>
        {queue.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", background: "var(--background)", border: "2px dashed var(--border)", borderRadius: "8px" }}>
            <p style={{ color: "var(--secondary)", fontSize: "14px" }}>No pending requests</p>
          </div>
        ) : (
          queue.map((request) => {
            const colors = priorityColors[request.priority];
            const icon = serviceIcons[request.serviceType] || "📋";

            return (
              <button
                key={request.id}
                onClick={() => handleClick(request.id)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: "var(--card-bg)",
                  textAlign: "left",
                  width: "100%"
                }}
                className="hover:border-primary hover:shadow-md"
                title={request.notes}
              >
                <div className="flex items-start gap-3">
                  <div style={{ fontSize: "20px" }}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontWeight: "600", fontSize: "13px", color: "var(--foreground)" }}>{request.id}</span>
                      <span style={{ fontSize: "11px", padding: "3px 8px", background: "var(--background)", borderRadius: "4px", fontWeight: "600", color: "var(--foreground)" }}>
                        {colors.icon} {request.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                      {request.guestName} - Room {request.roomNumber}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--foreground)", marginTop: "4px", fontWeight: "500" }}>{request.serviceType}</p>
                  </div>
                </div>
                {request.assignedStaffIds.length > 0 && (
                  <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "11px", background: "var(--background)", padding: "3px 8px", borderRadius: "4px", color: "var(--foreground)", fontWeight: "500" }}>
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
