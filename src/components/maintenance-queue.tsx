"use client";

import { Room } from "@/types/room";
import { useRoomStatus } from "@/store/useRoomStatus";
import { useToast } from "./toast";

interface MaintenanceQueueProps {
  rooms: Room[];
  onRefresh?: () => void;
}

export function MaintenanceQueue({ rooms, onRefresh }: MaintenanceQueueProps) {
  const maintenanceRooms = rooms.filter(r => r.status === "Under Maintenance");
  const { markClean } = useRoomStatus();
  const { showToast } = useToast();

  const handleMarkFixed = (roomId: string) => {
    markClean(roomId);
    showToast("Maintenance completed and room marked as clean", "success");
    onRefresh?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#28a745";
      case "In Progress":
        return "#0066cc";
      case "Pending":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  if (maintenanceRooms.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          No rooms in maintenance queue
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Maintenance Queue ({maintenanceRooms.length})
        </h3>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Room
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Issue
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Assigned Staff
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                ETA
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRooms.map(room => (
              <tr
                key={room.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--background)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                    {room.roomNumber}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--foreground)" }}>
                  {room.maintenanceStatus?.issue || "No issue recorded"}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--foreground)" }}>
                  {room.maintenanceStatus?.assignedTo || "Unassigned"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: getStatusColor(room.maintenanceStatus?.status || ""),
                      background: `${getStatusColor(room.maintenanceStatus?.status || "")}20`,
                      textTransform: "capitalize",
                    }}
                  >
                    {room.maintenanceStatus?.status || "Unknown"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                  {room.maintenanceStatus?.eta
                    ? new Date(room.maintenanceStatus.eta).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No ETA"}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => handleMarkFixed(room.id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "white",
                      background: "var(--success)",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.opacity = "0.8";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.opacity = "1";
                    }}
                  >
                    Mark Fixed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
