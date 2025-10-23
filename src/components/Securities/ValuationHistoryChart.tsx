"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSecurities } from "@/store/useSecurities";
import { useMemo } from "react";

export function ValuationHistoryChart() {
  const { valuations } = useSecurities();

  const chartData = useMemo(() => {
    return valuations
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((v) => ({
        date: v.date,
        companyValuation: v.companyValuation,
        perShareValue: v.perShareValue,
      }));
  }, [valuations]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {entry.name === "Company Valuation"
                ? `$${(entry.value / 1000000).toFixed(1)}M`
                : `$${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 border border-gray-200 flex items-center justify-center h-96">
        <p className="text-gray-500 text-center">No valuation history available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Valuation Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: "Company Valuation ($)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: "Per Share ($)", angle: 90, position: "insideRight" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="companyValuation"
            stroke="#3b82f6"
            name="Company Valuation"
            dot={{ fill: "#3b82f6" }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="perShareValue"
            stroke="#10b981"
            name="Per Share Value"
            dot={{ fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <p className="text-sm text-blue-600">Latest Company Valuation</p>
            <p className="text-2xl font-bold text-blue-900">
              ${(chartData[chartData.length - 1].companyValuation / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-green-50 rounded p-4">
            <p className="text-sm text-green-600">Per Share Value</p>
            <p className="text-2xl font-bold text-green-900">${chartData[chartData.length - 1].perShareValue.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
