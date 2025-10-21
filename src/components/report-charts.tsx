"use client";

import { Report } from "@/store/useReports";

interface RevenueChartProps {
  reports: Report[];
}

export function RevenueChart({ reports }: RevenueChartProps) {
  const revenueReports = reports.filter((r) => r.type === "Revenue").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const maxRevenue = Math.max(...revenueReports.map((r) => r.amount), 1);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
        Revenue Trend
      </h3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "240px", marginBottom: "16px" }}>
        {revenueReports.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No revenue data</p>
        ) : (
          revenueReports.map((report) => {
            const height = (report.amount / maxRevenue) * 100;
            return (
              <div
                key={report.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    background: "linear-gradient(180deg, #28a745 0%, #20c997 100%)",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  title={`$${report.amount.toLocaleString()}`}
                />
                <small style={{ fontSize: "11px", color: "var(--secondary)", textAlign: "center" }}>
                  {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px", fontSize: "12px", color: "var(--secondary)" }}>
        Total Revenue: <strong style={{ color: "var(--foreground)" }}>${revenueReports.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</strong>
      </div>
    </div>
  );
}

export function ExpenseChart({ reports }: RevenueChartProps) {
  const expenseReports = reports.filter((r) => r.type === "Expense").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const maxExpense = Math.max(...expenseReports.map((r) => r.amount), 1);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
        Expense Trend
      </h3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "240px", marginBottom: "16px" }}>
        {expenseReports.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No expense data</p>
        ) : (
          expenseReports.map((report) => {
            const height = (report.amount / maxExpense) * 100;
            return (
              <div
                key={report.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    background: "linear-gradient(180deg, #dc3545 0%, #fd7e14 100%)",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  title={`$${report.amount.toLocaleString()}`}
                />
                <small style={{ fontSize: "11px", color: "var(--secondary)", textAlign: "center" }}>
                  {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px", fontSize: "12px", color: "var(--secondary)" }}>
        Total Expenses: <strong style={{ color: "var(--foreground)" }}>${expenseReports.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</strong>
      </div>
    </div>
  );
}

export function ProfitLossChart({ reports }: RevenueChartProps) {
  const dailyData: Record<string, { revenue: number; expense: number }> = {};

  reports.forEach((report) => {
    const date = report.date;
    if (!dailyData[date]) {
      dailyData[date] = { revenue: 0, expense: 0 };
    }

    if (report.type === "Revenue") {
      dailyData[date].revenue += report.amount;
    } else {
      dailyData[date].expense += report.amount;
    }
  });

  const sortedDates = Object.keys(dailyData).sort();
  const maxProfit = Math.max(
    ...sortedDates.map((date) => dailyData[date].revenue - dailyData[date].expense),
    1
  );
  const minProfit = Math.min(
    ...sortedDates.map((date) => dailyData[date].revenue - dailyData[date].expense),
    0
  );
  const range = maxProfit - minProfit;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
        Profit & Loss
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "240px", marginBottom: "16px" }}>
        {sortedDates.length === 0 ? (
          <p style={{ color: "var(--secondary)" }}>No data available</p>
        ) : (
          sortedDates.map((date) => {
            const profit = dailyData[date].revenue - dailyData[date].expense;
            const isPositive = profit >= 0;
            const height = Math.abs(profit) > 0 ? (Math.abs(profit) / Math.max(Math.abs(maxProfit), Math.abs(minProfit))) * 100 : 0;

            return (
              <div
                key={date}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    background: isPositive ? "linear-gradient(180deg, #28a745 0%, #20c997 100%)" : "linear-gradient(180deg, #dc3545 0%, #fd7e14 100%)",
                    borderRadius: isPositive ? "4px 4px 0 0" : "0 0 4px 4px",
                    transition: "all 0.3s",
                  }}
                  title={`$${profit.toLocaleString()}`}
                />
                <small style={{ fontSize: "11px", color: "var(--secondary)", textAlign: "center" }}>
                  {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px", fontSize: "12px" }}>
          <span style={{ color: "var(--secondary)" }}>Highest Profit: </span>
          <strong style={{ color: "#28a745" }}>
            ${Math.max(...sortedDates.map((date) => dailyData[date].revenue - dailyData[date].expense), 0).toLocaleString()}
          </strong>
        </div>
        <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px", fontSize: "12px" }}>
          <span style={{ color: "var(--secondary)" }}>Lowest Profit: </span>
          <strong style={{ color: "#dc3545" }}>
            ${Math.min(...sortedDates.map((date) => dailyData[date].revenue - dailyData[date].expense), 0).toLocaleString()}
          </strong>
        </div>
      </div>
    </div>
  );
}
