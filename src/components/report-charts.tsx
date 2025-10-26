"use client";

import React from "react";
import { Report } from "@/store/useReports";

interface RevenueChartProps {
  reports: Report[];
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const chartAreaHeight = 180; // px available for bars (keeps behavior consistent)

export function RevenueChart({ reports }: RevenueChartProps) {
  const revenueReports = reports
    .filter(
      (r) =>
        r.type === "Revenue" && r.date && !isNaN(new Date(r.date).getTime())
    )
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const values = revenueReports.map((r) => Number(r.amount) || 0);
  const maxRevenue = Math.max(1, ...values); // ensure >=1 to avoid division by zero

  const total = values.reduce((s, v) => s + v, 0);

  return (
    <div style={cardStyle}>
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--foreground)",
        }}
      >
        Revenue Trend
      </h3>

      <div
        style={{
          display: "flex",
          gap: 12,
          height: chartAreaHeight + 40,
          alignItems: "flex-end",
          marginBottom: 16,
        }}
      >
        {revenueReports.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No revenue data</p>
        ) : (
          revenueReports.map((report) => {
            const amount = Number(report.amount) || 0;
            const heightPx = Math.round(
              (amount / maxRevenue) * chartAreaHeight
            );

            return (
              <div
                key={report.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  minWidth: 32,
                }}
              >
                <div
                  role="img"
                  aria-label={`Revenue ${amount}`}
                  style={{
                    width: "80%",
                    height: heightPx + "px",
                    background:
                      "linear-gradient(180deg, #28a745 0%, #20c997 100%)",
                    borderRadius: 6,
                    transition: "transform 0.18s, opacity 0.18s",
                    boxShadow: "rgba(0,0,0,0.06) 0 2px 6px",
                  }}
                  title={`$${amount.toLocaleString()}`}
                />
                <small
                  style={{
                    fontSize: 11,
                    color: "var(--secondary)",
                    textAlign: "center",
                  }}
                >
                  {new Date(report.date!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          padding: "12px",
          background: "var(--background)",
          borderRadius: 4,
          fontSize: 12,
          color: "var(--secondary)",
        }}
      >
        Total Revenue:{" "}
        <strong style={{ color: "var(--foreground)" }}>
          ${total.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

export function ExpenseChart({ reports }: RevenueChartProps) {
  // only include expense reports that have a valid parsable date to avoid Invalid Date errors
  const expenseReports = reports
    .filter(
      (r) =>
        r.type === "Expense" && r.date && !isNaN(new Date(r.date).getTime())
    )
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const values = expenseReports.map((r) => Number(r.amount) || 0);
  const maxExpense = Math.max(1, ...values);

  const total = values.reduce((s, v) => s + v, 0);

  return (
    <div style={cardStyle}>
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--foreground)",
        }}
      >
        Expense Trend
      </h3>

      <div
        style={{
          display: "flex",
          gap: 12,
          height: chartAreaHeight + 40,
          alignItems: "flex-end",
          marginBottom: 16,
        }}
      >
        {expenseReports.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No expense data</p>
        ) : (
          expenseReports.map((report) => {
            const amount = Number(report.amount) || 0;
            const heightPx = Math.round(
              (amount / maxExpense) * chartAreaHeight
            );

            return (
              <div
                key={report.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                  minWidth: 32,
                }}
              >
                <div
                  role="img"
                  aria-label={`Expense ${amount}`}
                  style={{
                    width: "80%",
                    height: heightPx + "px",
                    background:
                      "linear-gradient(180deg, #dc3545 0%, #fd7e14 100%)",
                    borderRadius: 6,
                    transition: "transform 0.18s, opacity 0.18s",
                    boxShadow: "rgba(0,0,0,0.06) 0 2px 6px",
                  }}
                  title={`$${amount.toLocaleString()}`}
                />
                <small
                  style={{
                    fontSize: 11,
                    color: "var(--secondary)",
                    textAlign: "center",
                  }}
                >
                  {new Date(report.date!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          padding: 12,
          background: "var(--background)",
          borderRadius: 4,
          fontSize: 12,
          color: "var(--secondary)",
        }}
      >
        Total Expenses:{" "}
        <strong style={{ color: "var(--foreground)" }}>
          ${total.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

export function ProfitLossChart({ reports }: RevenueChartProps) {
  // group by ISO date (yyyy-mm-dd) and ignore invalid/empty dates
  const dailyData: Record<string, { revenue: number; expense: number }> = {};

  reports.forEach((report) => {
    if (!report.date) return;
    const dt = new Date(report.date);
    if (isNaN(dt.getTime())) return;
    // use ISO date to group by day consistently
    const dateKey = dt.toISOString().split("T")[0];
    if (!dailyData[dateKey]) dailyData[dateKey] = { revenue: 0, expense: 0 };
    if (report.type === "Revenue")
      dailyData[dateKey].revenue += Number(report.amount) || 0;
    else dailyData[dateKey].expense += Number(report.amount) || 0;
  });

  const sortedDates = Object.keys(dailyData).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const profits = sortedDates.map(
    (d) => dailyData[d].revenue - dailyData[d].expense
  );

  const maxProfit = Math.max(...profits, 0);
  const minProfit = Math.min(...profits, 0);
  const maxAbs = Math.max(Math.abs(maxProfit), Math.abs(minProfit), 1);

  return (
    <div style={cardStyle}>
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--foreground)",
        }}
      >
        Profit & Loss
      </h3>

      <div
        style={{
          display: "flex",
          gap: 12,
          height: chartAreaHeight + 40,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {sortedDates.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No data available</p>
        ) : (
          sortedDates.map((date) => {
            const profit = dailyData[date].revenue - dailyData[date].expense;
            const heightPx = Math.round(
              (Math.abs(profit) / maxAbs) * chartAreaHeight
            );
            const isPositive = profit >= 0;

            return (
              <div
                key={date}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: isPositive ? "flex-end" : "flex-start",
                  gap: 8,
                  minWidth: 32,
                  height: chartAreaHeight,
                }}
              >
                <div
                  role="img"
                  aria-label={`Profit ${profit}`}
                  title={`$${profit.toLocaleString()}`}
                  style={{
                    width: "80%",
                    height: heightPx + "px",
                    background: isPositive
                      ? "linear-gradient(180deg, #28a745 0%, #20c997 100%)"
                      : "linear-gradient(180deg, #dc3545 0%, #fd7e14 100%)",
                    borderRadius: isPositive ? 6 : 6,
                    transformOrigin: isPositive ? "bottom" : "top",
                    transition: "transform 0.18s, opacity 0.18s",
                    boxShadow: "rgba(0,0,0,0.04) 0 1px 4px",
                  }}
                />
                <small
                  style={{
                    fontSize: 11,
                    color: "var(--secondary)",
                    textAlign: "center",
                  }}
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div
          style={{
            padding: 12,
            background: "var(--background)",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          <span style={{ color: "var(--secondary)" }}>Highest Profit: </span>
          <strong style={{ color: "#28a745" }}>
            ${Math.max(...profits, 0).toLocaleString()}
          </strong>
        </div>
        <div
          style={{
            padding: 12,
            background: "var(--background)",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          <span style={{ color: "var(--secondary)" }}>Lowest Profit: </span>
          <strong style={{ color: "#dc3545" }}>
            ${Math.min(...profits, 0).toLocaleString()}
          </strong>
        </div>
      </div>
    </div>
  );
}
