"use client";

import { useToast } from "./toast";
import { useRoomStatus } from "@/store/useRoomStatus";

interface QuickActionsProps {
  onRefresh?: () => void;
  onAddTask?: () => void;
}

export function QuickActions({ onRefresh, onAddTask }: QuickActionsProps) {
  const { showToast } = useToast();
  const { rooms, markClean } = useRoomStatus();

  const handleMarkAllClean = () => {
    const cleaningRooms = rooms.filter(
      r => r.status === "Needs Cleaning" || r.status === "Occupied"
    );

    if (cleaningRooms.length === 0) {
      showToast("No rooms need cleaning", "info");
      return;
    }

    cleaningRooms.forEach(room => {
      markClean(room.id);
    });

    showToast(`Marked ${cleaningRooms.length} rooms as clean`, "success");
    onRefresh?.();
  };

  const handleRefresh = () => {
    showToast("Room status refreshed", "info");
    onRefresh?.();
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={handleMarkAllClean}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "white",
          background: "var(--success)",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.opacity = "0.8";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        <span>🧹</span>
        Mark All Clean
      </button>

      <button
        onClick={handleRefresh}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--primary)",
          background: "transparent",
          border: "1px solid var(--primary)",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--primary)";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--primary)";
        }}
      >
        <span>🔄</span>
        Refresh Status
      </button>

      <button
        onClick={onAddTask}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--foreground)",
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
          (e.currentTarget as HTMLElement).style.background = "var(--primary)";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.background = "var(--background)";
          (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
        }}
      >
        <span>➕</span>
        Add Maintenance Task
      </button>
    </div>
  );
}
