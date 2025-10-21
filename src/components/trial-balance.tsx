"use client";

import { ChartOfAccounts, JournalEntry } from "@/types/accounting";

interface TrialBalanceProps {
  entries: JournalEntry[];
  chartOfAccounts: ChartOfAccounts[];
}

export function TrialBalance({ entries, chartOfAccounts }: TrialBalanceProps) {
  const postedEntries = entries.filter((entry) => entry.isPosted);
  const balances: Record<string, { debit: number; credit: number }> = {};

  postedEntries.forEach((entry) => {
    entry.lines.forEach((line) => {
      if (!balances[line.accountCode]) {
        balances[line.accountCode] = { debit: 0, credit: 0 };
      }

      if (line.type === "Debit") {
        balances[line.accountCode].debit += line.amount;
      } else {
        balances[line.accountCode].credit += line.amount;
      }
    });
  });

  const trialBalance = chartOfAccounts.map((account) => ({
    accountCode: account.code,
    accountName: account.name,
    debit: balances[account.code]?.debit || 0,
    credit: balances[account.code]?.credit || 0,
  }));

  const filteredBalance = trialBalance.filter((item) => item.debit > 0 || item.credit > 0);

  const totalDebits = filteredBalance.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = filteredBalance.reduce((sum, item) => sum + item.credit, 0);

  if (filteredBalance.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>No posted entries yet</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>Trial Balance</h3>
        <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "var(--secondary)" }}>
          as of {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Account Code
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Account Name
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Debit
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Credit
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBalance.map((item, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "var(--primary)", fontSize: "13px" }}>
                  {item.accountCode}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>
                  {item.accountName}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                  {item.debit > 0 ? `$${item.debit.toFixed(2)}` : "-"}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                  {item.credit > 0 ? `$${item.credit.toFixed(2)}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--background)", borderTop: "2px solid var(--border)", fontWeight: "700" }}>
              <td colSpan={2} style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                TOTALS:
              </td>
              <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "#0066cc" }}>
                ${totalDebits.toFixed(2)}
              </td>
              <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "#0066cc" }}>
                ${totalCredits.toFixed(2)}
              </td>
            </tr>
            {Math.abs(totalDebits - totalCredits) < 0.01 && (
              <tr style={{ background: "#28a74510", borderTop: "1px solid var(--border)" }}>
                <td colSpan={4} style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", color: "#28a745", fontWeight: "600" }}>
                  ✓ Trial Balance is Balanced
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );
}
