"use client";

import { motion } from "framer-motion";

interface FloorTabsProps {
  floors: number[];
  activeFloor: number | null;
  onFloorChange?: (floor: number | null) => void;
}

export function FloorTabs({ floors, activeFloor, onFloorChange }: FloorTabsProps) {
  return (
    <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "24px" }}>
      <button
        onClick={() => onFloorChange?.(null)}
        style={{
          padding: "12px 16px",
          background: activeFloor === null ? "transparent" : "transparent",
          border: "none",
          borderBottom: activeFloor === null ? "3px solid var(--primary)" : "3px solid transparent",
          color: activeFloor === null ? "var(--primary)" : "var(--secondary)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: activeFloor === null ? "600" : "500",
          transition: "all 0.2s",
        }}
      >
        All Floors
      </button>

      {floors.map(floor => (
        <button
          key={floor}
          onClick={() => onFloorChange?.(floor)}
          style={{
            padding: "12px 16px",
            background: "transparent",
            border: "none",
            borderBottom: activeFloor === floor ? "3px solid var(--primary)" : "3px solid transparent",
            color: activeFloor === floor ? "var(--primary)" : "var(--secondary)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeFloor === floor ? "600" : "500",
            transition: "all 0.2s",
          }}
        >
          Floor {floor}
        </button>
      ))}
    </div>
  );
}
