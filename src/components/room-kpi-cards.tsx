"use client";

import { motion } from "framer-motion";

interface RoomKPICardsProps {
  total: number;
  occupied: number;
  vacant: number;
  needsCleaning: number;
  underMaintenance: number;
}

export function RoomKPICards({
  total,
  occupied,
  vacant,
  needsCleaning,
  underMaintenance,
}: RoomKPICardsProps) {
  const cards = [
    { label: "Total Rooms", value: total, icon: "🏨", color: "#6c757d" },
    { label: "Occupied", value: occupied, icon: "🛏️", color: "#0066cc" },
    { label: "Vacant", value: vacant, icon: "🏠", color: "#28a745" },
    { label: "Needs Cleaning", value: needsCleaning, icon: "🧹", color: "#ffc107" },
    { label: "Under Maintenance", value: underMaintenance, icon: "⚙️", color: "#dc3545" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map(card => (
        <motion.div
          key={card.label}
          variants={itemVariants}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              background: `${card.color}10`,
              borderRadius: "50%",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "14px", color: "var(--secondary)" }}>
                {card.label}
              </span>
              <span style={{ fontSize: "24px" }}>{card.icon}</span>
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: card.color,
                marginBottom: "8px",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: card.color,
                }}
              />
              {card.label.toLowerCase()}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
