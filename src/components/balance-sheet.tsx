"use client";

import { ChartOfAccounts, JournalEntry } from "@/types/accounting";

interface BalanceSheetProps {
  chartOfAccounts: ChartOfAccounts[];
  entries: JournalEntry[];
}

export function BalanceSheet({ chartOfAccounts, entries }: BalanceSheetProps) {
  const postedEntries = entries.filter((e) => e.isPosted);
  const balances: Record<string, number> = {};

  postedEntries.forEach((entry) => {
    entry.lines.forEach((line) => {
      if (!balances[line.accountCode]) {
        balances[line.accountCode] = 0;
      }

      if (
        line.accountCode.startsWith("1") ||
        line.accountCode.startsWith("5")
      ) {
        balances[line.accountCode] +=
          line.type === "Debit" ? line.amount : -line.amount;
      } else {
        balances[line.accountCode] +=
          line.type === "Credit" ? line.amount : -line.amount;
      }
    });
  });

  const assets = chartOfAccounts
    .filter((a) => a.type === "Asset")
    .map((a) => ({
      ...a,
      balance: balances[a.code] || 0,
    }))
    .filter((a) => a.balance !== 0);

  const liabilities = chartOfAccounts
    .filter((a) => a.type === "Liability")
    .map((a) => ({
      ...a,
      balance: balances[a.code] || 0,
    }))
    .filter((a) => a.balance !== 0);

  const equity = chartOfAccounts
    .filter((a) => a.type === "Equity")
    .map((a) => ({
      ...a,
      balance: balances[a.code] || 0,
    }))
    .filter((a) => a.balance !== 0);

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
  const totalEquity = equity.reduce((sum, e) => sum + e.balance, 0);

  const isBalanced =
    Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

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
          Balance Sheet
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "var(--secondary)",
          }}
        >
          as of {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: "var(--foreground)",
            }}
          >
            ASSETS
          </h4>
          <div style={{ marginLeft: "12px", marginBottom: "12px" }}>
            {assets.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--secondary)",
                }}
              >
                No assets
              </p>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.code}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "var(--foreground)" }}>
                    {asset.code} - {asset.name}
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "var(--foreground)",
                    }}
                  >
                    ${asset.balance.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "2px solid var(--border)",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            <span style={{ color: "var(--foreground)" }}>Total Assets</span>
            <span style={{ color: "#0066cc" }}>
              ${totalAssets.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: "var(--foreground)",
            }}
          >
            LIABILITIES
          </h4>
          <div style={{ marginLeft: "12px", marginBottom: "12px" }}>
            {liabilities.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--secondary)",
                }}
              >
                No liabilities
              </p>
            ) : (
              liabilities.map((liability) => (
                <div
                  key={liability.code}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "var(--foreground)" }}>
                    {liability.code} - {liability.name}
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "var(--foreground)",
                    }}
                  >
                    ${liability.balance.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "1px solid var(--border)",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            <span style={{ color: "var(--foreground)" }}>
              Total Liabilities
            </span>
            <span style={{ color: "#0066cc" }}>
              ${totalLiabilities.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: "var(--foreground)",
            }}
          >
            EQUITY
          </h4>
          <div style={{ marginLeft: "12px", marginBottom: "12px" }}>
            {equity.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--secondary)",
                }}
              >
                No equity
              </p>
            ) : (
              equity.map((eq) => (
                <div
                  key={eq.code}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "var(--foreground)" }}>
                    {eq.code} - {eq.name}
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "var(--foreground)",
                    }}
                  >
                    ${eq.balance.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "1px solid var(--border)",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            <span style={{ color: "var(--foreground)" }}>Total Equity</span>
            <span style={{ color: "#0066cc" }}>
              ${totalEquity.toFixed(2)}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            background: isBalanced ? "#28a74510" : "#dc354510",
            borderRadius: "6px",
            border: `2px solid ${isBalanced ? "#28a745" : "#dc3545"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--foreground)",
              }}
            >
              Total Liabilities + Equity
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#0066cc",
              }}
            >
              ${(totalLiabilities + totalEquity).toFixed(2)}
            </span>
          </div>
          {isBalanced && (
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#28a745",
                fontWeight: "600",
              }}
            >
              ✓ Balance Sheet is Balanced
            </p>
          )}
          {!isBalanced && (
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#dc3545",
                fontWeight: "600",
              }}
            >
              ✗ Out of Balance by ${Math.abs(
                totalAssets - (totalLiabilities + totalEquity)
              ).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
