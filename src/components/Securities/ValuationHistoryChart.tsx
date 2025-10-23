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
        <div style={{
          background: "var(--background)",
          padding: "12px",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
        }}>
          <p style={{
            fontWeight: "600",
            color: "var(--primary)",
            margin: "0 0 6px 0"
          }}>{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, fontSize: "13px", margin: "4px 0" }}>
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
      <div style={{
        background: "var(--background)",
        borderRadius: "8px",
        padding: "32px",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "384px"
      }}>
        <p style={{
          color: "var(--secondary)",
          textAlign: "center",
          margin: 0
        }}>No valuation history available yet</p>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--background)",
      borderRadius: "8px",
      padding: "24px",
      border: "1px solid var(--border)"
    }}>
      <h3 style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "var(--primary)",
        marginBottom: "16px",
        margin: 0
      }}>Valuation Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--secondary)" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "var(--secondary)" }}
            label={{ value: "Company Valuation ($)", angle: -90, position: "insideLeft", fill: "var(--secondary)" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: "var(--secondary)" }}
            label={{ value: "Per Share ($)", angle: 90, position: "insideRight", fill: "var(--secondary)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px", color: "var(--secondary)" }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="companyValuation"
            stroke="#4a9eff"
            name="Company Valuation"
            dot={{ fill: "#4a9eff", r: 4 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="perShareValue"
            stroke="#28a745"
            name="Per Share Value"
            dot={{ fill: "#28a745", r: 4 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      {chartData.length > 0 && (
        <div style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(74, 158, 255, 0.05) 100%)",
            border: "1px solid rgba(74, 158, 255, 0.2)",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <p style={{
              fontSize: "12px",
              color: "#4a9eff",
              fontWeight: "600",
              margin: "0 0 8px 0"
            }}>Latest Company Valuation</p>
            <p style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#4a9eff",
              margin: 0
            }}>
              ${(chartData[chartData.length - 1].companyValuation / 1000000).toFixed(1)}M
            </p>
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%)",
            border: "1px solid rgba(40, 167, 69, 0.2)",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <p style={{
              fontSize: "12px",
              color: "#28a745",
              fontWeight: "600",
              margin: "0 0 8px 0"
            }}>Per Share Value</p>
            <p style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#28a745",
              margin: 0
            }}>
              ${chartData[chartData.length - 1].perShareValue.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
