"use client";

import { RoomStatus } from "@/types/task";
import { motion } from "framer-motion";

interface RoomStatusGridProps {
  rooms: RoomStatus[];
  onRoomClick?: (roomNumber: string) => void;
}

export function RoomStatusGrid({ rooms, onRoomClick }: RoomStatusGridProps) {
  const getRoomColor = (status: string) => {
    switch (status) {
      case "Clean":
        return {
          bg: "rgba(40, 167, 69, 0.1)",
          border: "var(--success)",
          icon: "🟢",
        };
      case "In Progress":
        return {
          bg: "rgba(0, 102, 204, 0.1)",
          border: "var(--primary)",
          icon: "🟡",
        };
      case "Dirty":
        return {
          bg: "rgba(220, 53, 69, 0.1)",
          border: "var(--danger)",
          icon: "🔴",
        };
      default:
        return {
          bg: "rgba(108, 117, 125, 0.1)",
          border: "var(--secondary)",
          icon: "⚪",
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "12px",
        padding: "24px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {rooms.map(room => {
        const colors = getRoomColor(room.status);

        return (
          <motion.button
            key={room.roomNumber}
            onClick={() => onRoomClick?.(room.roomNumber)}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px",
              background: colors.bg,
              border: `2px solid ${colors.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "20px" }}>{colors.icon}</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--foreground)",
              }}
            >
              {room.roomNumber}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--secondary)",
              }}
            >
              {room.status}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
