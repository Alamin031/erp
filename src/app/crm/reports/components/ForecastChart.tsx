"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ForecastDataPoint } from "@/store/useReports";

interface Props {
  data: ForecastDataPoint[];
}

export function ForecastChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No forecast data available</p>
      </div>
    );
  }

  const avgVariance =
    Math.abs(data.reduce((sum, d) => sum + d.variance, 0) / data.length) || 0;
  const accuracy = Math.max(0, 100 - avgVariance / 1000);

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
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8 }}>Forecast vs Actual</h3>
        <div
          style={{
            padding: "12px",
            borderRadius: 6,
            backgroundColor: "var(--background)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Forecast Accuracy</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--success)" }}>
            {Math.round(accuracy)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
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
          <Bar dataKey="predicted" fill="var(--primary)" name="Predicted" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="var(--success)" name="Actual" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
