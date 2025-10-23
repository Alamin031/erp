"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useSecurities } from "@/store/useSecurities";
import { useMemo } from "react";

const COLORS = ["var(--primary)", "var(--danger)", "var(--success)", "var(--warning)", "#8b5cf6"];

export function CapTableChart() {
  const { getCapTableData } = useSecurities();
  const capTableData = useMemo(() => getCapTableData(), [getCapTableData]);

  const pieData = capTableData.ownership.map((item) => ({
    name: item.category,
    value: Number(item.percentage.toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const ownershipItem = capTableData.ownership.find((o) => o.category === data.name);
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
          }}>{data.name}</p>
          <p style={{
            fontSize: "13px",
            color: "var(--secondary)",
            margin: "4px 0"
          }}>Percentage: {data.value.toFixed(2)}%</p>
          {ownershipItem && (
            <>
              <p style={{
                fontSize: "13px",
                color: "var(--secondary)",
                margin: "4px 0"
              }}>Shares: {ownershipItem.shares.toLocaleString()}</p>
              <p style={{
                fontSize: "13px",
                color: "var(--secondary)",
                margin: "4px 0"
              }}>
                Valuation: ${ownershipItem.valuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (pieData.length === 0) {
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
        }}>No ownership data available yet</p>
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
      }}>Cap Table (Ownership Distribution)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "var(--secondary)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        marginTop: "24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        {capTableData.ownership.map((item, idx) => (
          <div
            key={item.category}
            style={{
              background: "var(--border)",
              borderRadius: "6px",
              padding: "16px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  backgroundColor: COLORS[idx % COLORS.length]
                }}
              />
              <span style={{
                fontWeight: "700",
                color: "var(--primary)",
                fontSize: "14px"
              }}>{item.category}</span>
            </div>
            <div style={{
              fontSize: "13px",
              color: "var(--secondary)",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}>
              <p style={{ margin: 0 }}>
                Shares: <span style={{ fontWeight: "600", color: "var(--primary)" }}>{item.shares.toLocaleString()}</span>
              </p>
              <p style={{ margin: 0 }}>
                Ownership: <span style={{ fontWeight: "600", color: "var(--primary)" }}>{item.percentage.toFixed(2)}%</span>
              </p>
              <p style={{ margin: 0 }}>
                Valuation:{" "}
                <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                  ${item.valuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
