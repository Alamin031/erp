"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { SalesDataPoint } from "@/store/useReports";

interface Props {
  data: SalesDataPoint[];
}

export function SalesPerformanceChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No sales data available</p>
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
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Sales Performance</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--secondary)" style={{ fontSize: "12px" }} />
          <YAxis stroke="var(--secondary)" style={{ fontSize: "12px" }} />
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
          <Line
            type="monotone"
            dataKey="sales"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: "var(--primary)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Actual Sales"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--success)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "var(--success)", r: 4 }}
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
