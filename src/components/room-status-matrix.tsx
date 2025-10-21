"use client";

import { Room } from "@/types/room";
import { RoomCard } from "./room-card";
import { motion } from "framer-motion";

interface RoomStatusMatrixProps {
  rooms: Room[];
  onRoomClick?: (room: Room) => void;
  itemsPerRow?: number;
}

export function RoomStatusMatrix({
  rooms,
  onRoomClick,
  itemsPerRow = 10,
}: RoomStatusMatrixProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
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
        gridTemplateColumns: `repeat(auto-fill, minmax(100px, 1fr))`,
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
      {rooms.length > 0 ? (
        rooms.map(room => (
          <motion.div key={room.id} variants={itemVariants}>
            <RoomCard room={room} onClick={() => onRoomClick?.(room)} />
          </motion.div>
        ))
      ) : (
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--secondary)",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>No rooms found</p>
        </div>
      )}
    </motion.div>
  );
}
