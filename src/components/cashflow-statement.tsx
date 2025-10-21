"use client";

import { ARInvoice, APBill, JournalEntry } from "@/types/accounting";

interface CashflowStatementProps {
  arInvoices: ARInvoice[];
  apBills: APBill[];
  entries: JournalEntry[];
  startDate?: string;
  endDate?: string;
}

export function CashflowStatement({
  arInvoices,
  apBills,
  entries,
  startDate,
  endDate,
}: CashflowStatementProps) {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
  const end = endDate ? new Date(endDate) : new Date();

  const postedEntries = entries.filter((entry) => entry.isPosted);

  const operatingCash = postedEntries
    .filter((e) => e.date >= start.toISOString() && e.date <= end.toISOString())
    .reduce((sum, e) => {
      e.lines.forEach((line) => {
        if (
          line.accountCode.startsWith("4") ||
          line.accountCode.startsWith("5")
        ) {
          sum +=
            line.type === "Debit"
              ? -line.amount
              : line.amount;
        }
      });
      return sum;
    }, 0);

  const investingCash = postedEntries
    .filter((e) => e.date >= start.toISOString() && e.date <= end.toISOString())
    .reduce((sum, e) => {
      e.lines.forEach((line) => {
        if (line.accountCode.startsWith("1") && !line.accountCode.startsWith("12")) {
          sum +=
            line.type === "Debit"
              ? -line.amount
              : line.amount;
        }
      });
      return sum;
    }, 0);

  const financingCash = postedEntries
    .filter((e) => e.date >= start.toISOString() && e.date <= end.toISOString())
    .reduce((sum, e) => {
      e.lines.forEach((line) => {
        if (
          line.accountCode.startsWith("2") ||
          line.accountCode.startsWith("3")
        ) {
          sum +=
            line.type === "Credit"
              ? line.amount
              : -line.amount;
        }
      });
      return sum;
    }, 0);

  const netCashflow = operatingCash + investingCash + financingCash;

  const sections = [
    {
      name: "Operating Activities",
      value: operatingCash,
      color: "#0066cc",
    },
    {
      name: "Investing Activities",
      value: investingCash,
      color: "#28a745",
    },
    {
      name: "Financing Activities",
      value: financingCash,
      color: "#ffc107",
    },
  ];

  const maxValue = Math.max(
    ...sections.map((s) => Math.abs(s.value)),
    Math.abs(netCashflow)
  );

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
          Cash Flow Statement
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {sections.map((section) => (
            <div
              key={section.name}
              style={{
                padding: "16px",
                background: "var(--background)",
                borderRadius: "6px",
                border: `2px solid ${section.color}`,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  color: "var(--secondary)",
                }}
              >
                {section.name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: section.value >= 0 ? section.color : "#dc3545",
                }}
              >
                ${section.value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "16px",
            background: "var(--background)",
            borderRadius: "6px",
            border: `2px solid ${netCashflow >= 0 ? "#28a745" : "#dc3545"}`,
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px 0",
              fontSize: "12px",
              color: "var(--secondary)",
            }}
          >
            Net Cash Flow
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: netCashflow >= 0 ? "#28a745" : "#dc3545",
            }}
          >
            ${netCashflow.toFixed(2)}
          </p>
        </div>

        <h4
          style={{
            margin: "0 0 16px 0",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--foreground)",
          }}
        >
          Waterfall Chart
        </h4>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            height: "200px",
            marginBottom: "24px",
          }}
        >
          {sections.map((section) => {
            const height = (Math.abs(section.value) / maxValue) * 100;
            return (
              <div
                key={section.name}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    background: section.value >= 0 ? section.color : "#dc3545",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s",
                  }}
                />
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "11px",
                    color: "var(--secondary)",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {section.name.split(" ")[0]}
                </p>
              </div>
            );
          })}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${(Math.abs(netCashflow) / maxValue) * 100}%`,
                background:
                  netCashflow >= 0 ? "#28a745" : "#dc3545",
                borderRadius: "4px 4px 0 0",
                transition: "all 0.3s",
              }}
            />
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "11px",
                color: "var(--secondary)",
                textAlign: "center",
                width: "100%",
              }}
            >
              Net
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#0066cc10",
            borderRadius: "4px",
            border: "1px solid #0066cc20",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "var(--secondary)",
            }}
          >
            <strong>Note:</strong> Cash flow calculated from posted journal entries for the selected period.
          </p>
        </div>
      </div>
    </div>
  );
}
