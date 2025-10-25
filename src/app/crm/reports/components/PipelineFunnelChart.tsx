"use client";

import { motion } from "framer-motion";
import { PipelineStage } from "@/store/useReports";

interface Props {
  data: PipelineStage[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PipelineFunnelChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No pipeline data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "20px",
        borderRadius: 8,
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border)",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Pipeline Funnel</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((stage, index) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div style={{ marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{stage.name}</span>
              <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                {stage.count} ({stage.percentage}%)
              </span>
            </div>
            <div
              style={{
                width: `${(stage.count / maxCount) * 100}%`,
                height: "28px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: 6,
                transition: "width 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {stage.count}
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: "12px", color: "var(--secondary)" }}>
        <p>Conversion from Prospects to Closed: {data[data.length - 1]?.percentage}%</p>
      </div>
    </motion.div>
  );
}
