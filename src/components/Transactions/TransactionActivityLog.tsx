"use client";

import { useMemo } from "react";
import { useTransactions } from "@/store/useTransactions";
import { Clock } from "lucide-react";

interface Props {
  limit?: number;
}

export function TransactionActivityLog({ limit = 15 }: Props) {
  const { transactions } = useTransactions();

  const activityItems = useMemo(() => {
    const items: Array<{
      id: string;
      timestamp: string;
      title: string;
      description: string;
      icon: string;
      color: string;
    }> = [];

    transactions.forEach((txn) => {
      if (txn.auditLog) {
        txn.auditLog.forEach((entry) => {
          items.push({
            id: entry.id,
            timestamp: entry.timestamp,
            title: `${entry.action}: ${txn.type}`,
            description: `${txn.entity} - ${txn.quantity.toLocaleString()} shares - By ${entry.user}`,
            icon: entry.action === "Approved" ? "✓" : entry.action === "Rejected" ? "✕" : "◆",
            // use CSS variable colors for dark theme
            color:
              entry.action === "Approved"
                ? "var(--success)"
                : entry.action === "Rejected"
                ? "var(--danger)"
                : entry.action === "Executed"
                ? "var(--primary)"
                : "var(--secondary)",
          });
        });
      }
    });

    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [transactions, limit]);

  if (activityItems.length === 0) {
    return (
      <div style={{ padding: 16, boxSizing: "border-box", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8 }} className="text-center">
        <Clock size={32} style={{ color: "var(--secondary)", margin: "0 auto 12px" }} />
        <p style={{ color: "var(--secondary)" }}>No recent activity</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, boxSizing: "border-box", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8, height: "100%", display: "flex", flexDirection: "column" }}>
      <h3 style={{ color: "var(--foreground)", marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Recent Activity</h3>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {activityItems.map((item, idx) => (
            <div key={item.id} style={{ position: "relative", display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9999, border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: item.color }}>
                  {item.icon}
                </div>
                {idx < activityItems.length - 1 && <div style={{ width: 2, height: 48, background: "var(--border)", marginTop: 8, opacity: 0.7 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 12, color: "var(--secondary)", marginTop: 6 }}>{item.description}</p>
                <p style={{ fontSize: 12, color: "var(--secondary)", marginTop: 6 }}>{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
