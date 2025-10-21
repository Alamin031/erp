"use client";

import { Room } from "@/types/room";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
  onClick?: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Clean":
        return { bg: "rgba(40, 167, 69, 0.1)", border: "#28a745", icon: "🟢" };
      case "Occupied":
        return { bg: "rgba(0, 102, 204, 0.1)", border: "#0066cc", icon: "🔵" };
      case "Needs Cleaning":
        return { bg: "rgba(255, 193, 7, 0.1)", border: "#ffc107", icon: "🟡" };
      case "Under Maintenance":
        return { bg: "rgba(220, 53, 69, 0.1)", border: "#dc3545", icon: "🔴" };
      default:
        return { bg: "rgba(108, 117, 125, 0.1)", border: "#6c757d", icon: "⚪" };
    }
  };

  const colors = getStatusColor(room.status);
  const lastCleanedTime = room.lastCleaned
    ? new Date(room.lastCleaned).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  const tooltip = room.lastCleanedBy
    ? `Last cleaned ${lastCleanedTime} by ${room.lastCleanedBy}`
    : "Not cleaned yet";

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={tooltip}
      style={{
        padding: "12px",
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        minHeight: "100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "4px", right: "4px", fontSize: "16px" }}>
        {colors.icon}
      </div>

      <span
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "var(--foreground)",
        }}
      >
        {room.roomNumber}
      </span>

      <span
        style={{
          fontSize: "10px",
          color: "var(--secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {room.type}
      </span>

      <div style={{ display: "flex", gap: "4px", justifyContent: "center", fontSize: "14px" }}>
        {room.status === "Clean" && <span>🧹</span>}
        {room.status === "Occupied" && <span>🛏️</span>}
        {room.status === "Needs Cleaning" && <span>⚠️</span>}
        {room.status === "Under Maintenance" && <span>⚙️</span>}
      </div>

      <span
        style={{
          fontSize: "10px",
          color: colors.border,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {room.status}
      </span>
    </motion.button>
  );
}
