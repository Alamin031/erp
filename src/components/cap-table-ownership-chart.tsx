"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShareholderOwnership, EquityClassBreakdown } from "@/types/cap-table";

interface OwnershipPieChartProps {
  shareholderOwnership: ShareholderOwnership[];
  equityClassBreakdown: EquityClassBreakdown[];
}

const equityColors: Record<string, string> = {
  Common: "#2563eb",
  Preferred: "#059669",
  Options: "#f59e0b",
  Convertible: "#8b5cf6",
};

const shareholderColors = [
  "#2563eb",
  "#059669",
  "#f59e0b",
  "#8b5cf6",
  "#dc3545",
  "#17a2b8",
  "#fd7e14",
  "#6c757d",
  "#20c997",
  "#e83e8c",
];

export function OwnershipPieChart({
  shareholderOwnership,
  equityClassBreakdown,
}: OwnershipPieChartProps) {
  const [activeChart, setActiveChart] = useState<"shareholders" | "equity">("shareholders");

  const renderShareholderChart = () => {
    // Filter shareholders with ownership > 0.5%
    const significantShareholders = shareholderOwnership.filter((s) => s.ownershipPercentage > 0.5);
    const otherPercentage = shareholderOwnership
      .filter((s) => s.ownershipPercentage <= 0.5)
      .reduce((sum, s) => sum + s.ownershipPercentage, 0);

    const chartData = [
      ...significantShareholders,
      ...(otherPercentage > 0 ? [{ shareholderName: "Others", ownershipPercentage: otherPercentage } as any] : []),
    ];

    const circumference = 2 * Math.PI * 60;
    let cumulativeOffset = 0;

    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: "160px", height: "160px" }}>
          <svg
            width="160"
            height="160"
            style={{
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {chartData.map((item, idx) => {
              const arcLength = (item.ownershipPercentage / 100) * circumference;
              const offset = cumulativeOffset;
              cumulativeOffset += arcLength;

              return (
                <motion.circle
                  key={item.shareholderName}
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke={shareholderColors[idx % shareholderColors.length]}
                  strokeWidth="12"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: -circumference }}
                  animate={{ strokeDashoffset: -offset }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
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
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--foreground)" }}>
              {shareholderOwnership.length}
            </div>
            <div style={{ fontSize: "12px", color: "var(--secondary)" }}>Shareholders</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px" }}>
          {chartData.map((item, idx) => (
            <motion.div
              key={item.shareholderName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: shareholderColors[idx % shareholderColors.length],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "12px", color: "var(--foreground)", flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: "600" }}>{item.shareholderName}</span>
                {item.equityType && (
                  <span style={{ color: "var(--secondary)", marginLeft: "6px" }}>
                    ({item.equityType})
                  </span>
                )}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: shareholderColors[idx % shareholderColors.length], flexShrink: 0 }}>
                {item.ownershipPercentage.toFixed(2)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderEquityChart = () => {
    const circumference = 2 * Math.PI * 60;
    let cumulativeOffset = 0;

    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: "160px", height: "160px" }}>
          <svg
            width="160"
            height="160"
            style={{
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {equityClassBreakdown.map((item, idx) => {
              const arcLength = (item.percentageOfTotal / 100) * circumference;
              const offset = cumulativeOffset;
              cumulativeOffset += arcLength;

              return (
                <motion.circle
                  key={item.class}
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke={equityColors[item.class] || "#6b7280"}
                  strokeWidth="12"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: -circumference }}
                  animate={{ strokeDashoffset: -offset }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
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
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--foreground)" }}>
              {equityClassBreakdown.reduce((sum, e) => sum + e.issuedShares, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: "12px", color: "var(--secondary)" }}>Shares Issued</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px" }}>
          {equityClassBreakdown.map((item, idx) => (
            <motion.div
              key={item.class}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: `${equityColors[item.class] || "#6b7280"}10`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: equityColors[item.class] || "#6b7280",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", flex: 1 }}>
                  {item.class}
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: equityColors[item.class] || "#6b7280" }}>
                  {item.percentageOfTotal.toFixed(1)}%
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "var(--secondary)", marginLeft: "20px" }}>
                <span>{item.issuedShares.toLocaleString()} issued</span>
                <span>·</span>
                <span>{item.holdersCount} holders</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Ownership Distribution
        </h3>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveChart("shareholders")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              color: activeChart === "shareholders" ? "var(--primary)" : "var(--secondary)",
              background: activeChart === "shareholders" ? "var(--primary)10" : "transparent",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Shareholders
          </button>
          <button
            onClick={() => setActiveChart("equity")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              color: activeChart === "equity" ? "var(--primary)" : "var(--secondary)",
              background: activeChart === "equity" ? "var(--primary)10" : "transparent",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Equity Classes
          </button>
        </div>
      </div>

      <motion.div
        key={activeChart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeChart === "shareholders" ? renderShareholderChart() : renderEquityChart()}
      </motion.div>
    </motion.div>
  );
}
