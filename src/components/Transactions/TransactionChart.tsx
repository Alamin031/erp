"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTransactions } from "@/store/useTransactions";
import { useMemo, useState } from "react";

export function TransactionChart() {
  const { getTransactionsByType, getMonthlyTransactionData } = useTransactions();
  const [activeChart, setActiveChart] = useState<"byType" | "monthly">("byType");

  const transactionsByType = useMemo(() => {
    const counts = getTransactionsByType();
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({ type, count }));
  }, [getTransactionsByType]);

  const monthlyData = useMemo(() => getMonthlyTransactionData(), [getMonthlyTransactionData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "var(--card-bg)",
            padding: 12,
            border: "1px solid var(--border)",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            color: "var(--foreground)",
            minWidth: 120,
          }}
        >
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{ 
        padding: 16, 
        height: "360px", 
        maxHeight: "360px",
        boxSizing: "border-box", 
        background: "var(--card-bg)", 
        border: "1px solid var(--border)", 
        borderRadius: 8,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="flex items-center justify-between mb-4" style={{ flexShrink: 0 }}>
        <h3 style={{ color: "var(--foreground)" }} className="text-lg font-semibold">
          Transaction Analysis
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveChart("byType")}
            style={{ minWidth: 96, height: 36, padding: "6px 12px" }}
            className={`rounded-lg text-sm font-medium transition ${
              activeChart === "byType"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800"
            }`}
          >
            By Type
          </button>
          <button
            onClick={() => setActiveChart("monthly")}
            style={{ minWidth: 110, height: 36, padding: "6px 12px" }}
            className={`rounded-lg text-sm font-medium transition ${
              activeChart === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800"
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {activeChart === "byType" && (
        <>
          {transactionsByType.length === 0 ? (
            <div className="flex items-center justify-center" style={{ flex: 1 }}>
              <p style={{ color: "var(--secondary)" }}>No transaction data available</p>
            </div>
          ) : (
            <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsByType} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="type" stroke="var(--secondary)" />
                  <YAxis stroke="var(--secondary)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3b82f6" name="Transaction Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {activeChart === "monthly" && (
        <>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center" style={{ flex: 1 }}>
              <p style={{ color: "var(--secondary)" }}>No monthly data available</p>
            </div>
          ) : (
            <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="var(--secondary)" />
                  <YAxis stroke="var(--secondary)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span style={{ color: "var(--secondary)" }}>{value}</span>} />
                  <Line
                    type="monotone"
                    dataKey="issuances"
                    stroke="#10b981"
                    name="Issuances"
                    dot={{ fill: "#10b981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="exercises"
                    stroke="#3b82f6"
                    name="Exercises"
                    dot={{ fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transfers"
                    stroke="#f59e0b"
                    name="Transfers"
                    dot={{ fill: "#f59e0b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancellations"
                    stroke="#ef4444"
                    name="Cancellations"
                    dot={{ fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
