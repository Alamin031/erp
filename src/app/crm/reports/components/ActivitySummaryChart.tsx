"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ActivitySummary } from "@/store/useReports";

interface Props {
  data: ActivitySummary[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function ActivitySummaryChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No activity data available</p>
      </div>
    );
  }

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
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Activity Summary</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="type" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--foreground)" }} />
          <Legend wrapperStyle={{ color: "var(--secondary)", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
