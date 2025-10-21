"use client";

import { Campaign } from "@/types/campaigns";

interface BudgetUsageChartProps {
  campaigns: Campaign[];
}

export function BudgetUsageChart({ campaigns }: BudgetUsageChartProps) {
  const generateChartData = () => {
    const sorted = [...campaigns].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return sorted.slice(0, 10).map((campaign) => ({
      name: campaign.name.substring(0, 15),
      budget: campaign.budget,
      spend: campaign.spend,
      remaining: campaign.budget - campaign.spend,
      status: campaign.status,
    }));
  };

  const data = generateChartData();
  const maxBudget = Math.max(...data.map((d) => d.budget), 5000);

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
        Budget Usage
      </h3>

      <div style={{ height: "300px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
        {data.length === 0 ? (
          <div style={{ width: "100%", textAlign: "center", color: "var(--secondary)", paddingTop: "60px" }}>
            <p>No campaign data available</p>
          </div>
        ) : (
          data.map((item, index) => {
            const budgetHeight = (item.budget / maxBudget) * 250;
            const spendHeight = (item.spend / maxBudget) * 250;
            const spendPercent = item.budget > 0 ? (item.spend / item.budget) * 100 : 0;

            return (
              <div
                key={index}
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
                    width: "100%",
                    height: `${budgetHeight}px`,
                    background: "#e5e7eb",
                    borderRadius: "4px 4px 0 0",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  title={`Budget: $${item.budget.toFixed(2)}, Spend: $${item.spend.toFixed(2)} (${spendPercent.toFixed(1)}%)`}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${spendHeight}px`,
                      background: getColorByStatus(item.status),
                      borderRadius: "0 0 0 0",
                      opacity: 0.85,
                      position: "absolute",
                      bottom: 0,
                      transition: "all 0.3s",
                    }}
                  />
                </div>
                <span style={{ fontSize: "11px", color: "var(--secondary)", textAlign: "center", wordBreak: "break-word", maxWidth: "60px" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: "10px", fontWeight: "600", color: "var(--secondary)" }}>
                  {spendPercent.toFixed(0)}% used
                </span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "12px" }}>
        <div>
          <div style={{ color: "var(--secondary)", marginBottom: "8px" }}>Total Budget</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
            ${data.reduce((sum, d) => sum + d.budget, 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div style={{ color: "var(--secondary)", marginBottom: "8px" }}>Total Spend</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
            ${data.reduce((sum, d) => sum + d.spend, 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
}
