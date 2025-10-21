"use client";

import { Room } from "@/types/room";

interface OccupancyChartProps {
  rooms: Room[];
}

export function OccupancyChart({ rooms }: OccupancyChartProps) {
  const occupied = rooms.filter(r => r.status === "Occupied").length;
  const vacant = rooms.filter(r => r.status === "Clean").length;
  const needsCleaning = rooms.filter(r => r.status === "Needs Cleaning").length;
  const maintenance = rooms.filter(r => r.status === "Under Maintenance").length;

  const total = rooms.length;
  const occupiedPercent = total > 0 ? (occupied / total) * 100 : 0;
  const vacantPercent = total > 0 ? (vacant / total) * 100 : 0;
  const cleaningPercent = total > 0 ? (needsCleaning / total) * 100 : 0;
  const maintenancePercent = total > 0 ? (maintenance / total) * 100 : 0;

  const data = [
    { label: "Occupied", value: occupiedPercent, count: occupied, color: "#0066cc" },
    { label: "Vacant", value: vacantPercent, count: vacant, color: "#28a745" },
    { label: "Needs Cleaning", value: cleaningPercent, count: needsCleaning, color: "#ffc107" },
    { label: "Maintenance", value: maintenancePercent, count: maintenance, color: "#dc3545" },
  ];

  const circumference = 2 * Math.PI * 45;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Occupancy Overview
      </h3>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px" }}>
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg
            width="120"
            height="120"
            style={{
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            {data.reduce((offset, item, idx) => {
              const value = (item.value / 100) * circumference;
              return (
                <>
                  {idx > 0 && (
                    <circle
                      key={`${item.label}-segment`}
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={`${value} ${circumference}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  )}
                  {offset + value}
                </>
              );
            }, 0)}
            {data.map((item, idx) => {
              const offset = data.slice(0, idx).reduce((sum, d) => sum + (d.value / 100) * circumference, 0);
              const value = (item.value / 100) * circumference;
              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={`${value} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--foreground)" }}>
              {total}
            </div>
            <div style={{ fontSize: "12px", color: "var(--secondary)" }}>Total Rooms</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span style={{ fontSize: "13px", color: "var(--foreground)", minWidth: "120px" }}>
                {item.label}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: item.color }}>
                {item.count}
              </span>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                ({item.value.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
