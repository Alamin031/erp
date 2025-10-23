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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction Analysis</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveChart("byType")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeChart === "byType"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            By Type
          </button>
          <button
            onClick={() => setActiveChart("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeChart === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {activeChart === "byType" && (
        <>
          {transactionsByType.length === 0 ? (
            <div className="flex items-center justify-center h-80">
              <p className="text-gray-500">No transaction data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" name="Transaction Count" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      )}

      {activeChart === "monthly" && (
        <>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-80">
              <p className="text-gray-500">No monthly data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
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
          )}
        </>
      )}
    </div>
  );
}
