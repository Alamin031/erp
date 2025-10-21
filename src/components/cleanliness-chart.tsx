"use client";

import { Room } from "@/types/room";

interface CleanlinessChartProps {
  rooms: Room[];
}

export function CleanlinessChart({ rooms }: CleanlinessChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      shortDate: date.toLocaleDateString("en-US", { weekday: "short" }),
      count: Math.floor(Math.random() * 15) + 5,
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count));
  const avgCleaning = Math.round(last7Days.reduce((sum, d) => sum + d.count, 0) / 7);

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
        Cleaning Frequency (Last 7 Days)
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "180px" }}>
          {last7Days.map((day, idx) => {
            const height = (day.count / maxCount) * 160;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    height: `${height}px`,
                    width: "100%",
                    background: "#0066cc",
                    borderRadius: "4px 4px 0 0",
                    position: "relative",
                    transition: "background 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#0052a3";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "#0066cc";
                  }}
                  title={`${day.count} rooms cleaned`}
                />
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  {day.shortDate}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            style={{
              padding: "12px",
              background: "var(--background)",
              borderRadius: "6px",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
              Average Daily Cleanings
            </p>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>
              {avgCleaning}
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              background: "var(--background)",
              borderRadius: "6px",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
              Peak Cleaning Day
            </p>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--success)" }}>
              {Math.max(...last7Days.map(d => d.count))} rooms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
