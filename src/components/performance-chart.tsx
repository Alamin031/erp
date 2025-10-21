"use client";

import { Campaign } from "@/types/campaigns";

interface PerformanceChartProps {
  campaigns: Campaign[];
}

export function PerformanceChart({ campaigns }: PerformanceChartProps) {
  const generateChartData = () => {
    const sorted = [...campaigns]
      .filter((c) => c.ctr > 0)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return sorted.slice(0, 10).map((campaign) => ({
      name: campaign.name.substring(0, 15),
      ctr: campaign.ctr,
      roi: campaign.roi,
      status: campaign.status,
    }));
  };

  const data = generateChartData();
  const maxCTR = Math.max(...data.map((d) => d.ctr), 5);

  const getColorByStatus = (status: string) => {
    switch (status) {
      case "Active":
        return "#2563eb";
      case "Completed":
        return "#059669";
      case "Draft":
        return "#9ca3af";
      default:
        return "#6366f1";
    }
  };

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        CTR Performance Over Time
      </h3>

      <div style={{ height: "300px", display: "flex", alignItems: "flex-end", gap: "12px", position: "relative" }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`grid-${i}`}
            style={{
              position: "absolute",
              width: "100%",
              height: "1px",
              background: "var(--border)",
              top: `${((4 - i) / 4) * 100}%`,
              opacity: 0.5,
            }}
          />
        ))}

        {data.length === 0 ? (
          <div style={{ width: "100%", textAlign: "center", color: "var(--secondary)", paddingTop: "60px" }}>
            <p>No campaign data available</p>
          </div>
        ) : (
          data.map((item, index) => {
            const barHeight = (item.ctr / maxCTR) * 250;

            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${barHeight}px`,
                    background: getColorByStatus(item.status),
                    borderRadius: "4px 4px 0 0",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    opacity: 0.85,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  title={`Campaign: ${item.name}, CTR: ${item.ctr.toFixed(2)}%, ROI: ${item.roi.toFixed(0)}%`}
                />
                <span style={{ fontSize: "11px", color: "var(--secondary)", textAlign: "center", wordBreak: "break-word", maxWidth: "60px" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: "10px", fontWeight: "600", color: "var(--foreground)" }}>
                  {item.ctr.toFixed(2)}%
                </span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "12px" }}>
        <div>
          <div style={{ color: "var(--secondary)", marginBottom: "8px" }}>Average CTR</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
            {data.length > 0 ? (data.reduce((sum, d) => sum + d.ctr, 0) / data.length).toFixed(2) : "0.00"}%
          </div>
        </div>
        <div>
          <div style={{ color: "var(--secondary)", marginBottom: "8px" }}>Average ROI</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#059669" }}>
            {data.length > 0 ? "+" : ""}
            {data.length > 0 ? (data.reduce((sum, d) => sum + d.roi, 0) / data.length).toFixed(0) : "0"}%
          </div>
        </div>
      </div>
    </div>
  );
}
