"use client";

import { JournalEntry } from "@/types/accounting";

interface ProfitLossProps {
  entries: JournalEntry[];
  startDate?: string;
  endDate?: string;
}

export function ProfitLoss({ entries, startDate, endDate }: ProfitLossProps) {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
  const end = endDate ? new Date(endDate) : new Date();

  const postedEntries = entries.filter(
    (e) =>
      e.isPosted &&
      e.date >= start.toISOString() &&
      e.date <= end.toISOString()
  );

  let totalRevenue = 0;
  let totalExpense = 0;

  postedEntries.forEach((entry) => {
    entry.lines.forEach((line) => {
      if (line.accountCode.startsWith("4")) {
        totalRevenue +=
          line.type === "Credit" ? line.amount : -line.amount;
      } else if (line.accountCode.startsWith("5")) {
        totalExpense +=
          line.type === "Debit" ? line.amount : -line.amount;
      }
    });
  });

  const netIncome = totalRevenue - totalExpense;
  const netMargin =
    totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
        <h3
          style={{
            margin: "0 0 4px 0",
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--foreground)",
          }}
        >
          Profit & Loss Statement
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "var(--secondary)",
          }}
        >
          {start.toLocaleDateString()} to {end.toLocaleDateString()}
        </p>
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Total Revenue
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#28a745",
              }}
            >
              ${totalRevenue.toFixed(2)}
            </span>
          </div>

          <div style={{ marginTop: "16px", marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "12px",
                borderBottom: "2px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                Total Expenses
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#dc3545",
                }}
              >
                ${totalExpense.toFixed(2)}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background:
                netIncome >= 0 ? "#28a74510" : "#dc354510",
              borderRadius: "6px",
              border: `2px solid ${
                netIncome >= 0 ? "#28a745" : "#dc3545"
              }`,
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              Net Income
            </p>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "24px",
                fontWeight: "700",
                color: netIncome >= 0 ? "#28a745" : "#dc3545",
              }}
            >
              ${netIncome.toFixed(2)}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              Net Margin: {netMargin.toFixed(2)}%
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div style={{ padding: "16px", background: "var(--background)", borderRadius: "6px" }}>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              Revenue
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#28a745",
              }}
            >
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--background)", borderRadius: "6px" }}>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              Expenses
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#dc3545",
              }}
            >
              ${totalExpense.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
