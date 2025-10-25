"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { AgentPerformance } from "@/store/useReports";

interface Props {
  data: AgentPerformance[];
}

export function AgentPerformanceChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No agent data available</p>
      </div>
    );
  }

  const chartData = data.map((agent) => ({
    name: agent.name.split(" ")[0],
    revenue: agent.revenue,
    deals: agent.dealsClosedThisMonth,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        padding: "20px",
        borderRadius: 8,
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border)",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Agent Performance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" stroke="var(--secondary)" style={{ fontSize: "12px" }} />
          <YAxis dataKey="name" type="category" stroke="var(--secondary)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--foreground)",
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ color: "var(--secondary)", fontSize: "12px" }} />
          <Bar dataKey="revenue" fill="var(--primary)" name="Revenue" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 16, fontSize: "12px", color: "var(--secondary)" }}>
        <p>Top performer: {data[0]?.name} - ${data[0]?.revenue.toLocaleString()} revenue</p>
      </div>
    </motion.div>
  );
}
