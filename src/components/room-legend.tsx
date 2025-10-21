"use client";

export function RoomLegend() {
  const legendItems = [
    { icon: "🟢", label: "Clean & Vacant", color: "#28a745" },
    { icon: "🔵", label: "Occupied", color: "#0066cc" },
    { icon: "🟡", label: "Needs Cleaning", color: "#ffc107" },
    { icon: "🔴", label: "Under Maintenance", color: "#dc3545" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "16px",
        background: "var(--background)",
        borderRadius: "6px",
        flexWrap: "wrap",
      }}
    >
      {legendItems.map(item => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>{item.icon}</span>
          <span style={{ fontSize: "13px", color: "var(--foreground)" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
