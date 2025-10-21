"use client";

import { ARInvoice, APBill } from "@/types/accounting";

interface AgingReportProps {
  items: ARInvoice[] | APBill[];
  type: "AR" | "AP";
}

export function AgingReport({ items, type }: AgingReportProps) {
  const now = new Date();

  const buckets: Record<string, { count: number; amount: number }> = {
    "0-30": { count: 0, amount: 0 },
    "31-60": { count: 0, amount: 0 },
    "61-90": { count: 0, amount: 0 },
    "90+": { count: 0, amount: 0 },
  };

  items.forEach((item) => {
    if (item.status === "Paid") return;

    const daysOverdue = Math.floor(
      (now.getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    let bucket = "0-30";
    if (daysOverdue > 90) bucket = "90+";
    else if (daysOverdue > 60) bucket = "61-90";
    else if (daysOverdue > 30) bucket = "31-60";

    buckets[bucket].count += 1;
    buckets[bucket].amount += item.balance;
  });

  const totalAmount = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0);

  const bucketLabels: Record<string, string> = {
    "0-30": "Current (0-30 days)",
    "31-60": "Past Due (31-60 days)",
    "61-90": "Past Due (61-90 days)",
    "90+": "Past Due (90+ days)",
  };

  const bucketColors: Record<string, string> = {
    "0-30": "#28a745",
    "31-60": "#ffc107",
    "61-90": "#ff9800",
    "90+": "#dc3545",
  };

  const sortedBuckets = Object.entries(buckets).sort((a, b) => {
    const order = ["0-30", "31-60", "61-90", "90+"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
          {type === "AR" ? "Accounts Receivable" : "Accounts Payable"} Aging Report
        </h3>
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {sortedBuckets.map(([bucket, data]) => (
              <div
                key={bucket}
                style={{
                  padding: "16px",
                  background: "var(--background)",
                  borderRadius: "6px",
                  border: `2px solid ${bucketColors[bucket]}`,
                }}
              >
                <div style={{ fontSize: "13px", color: "var(--secondary)", marginBottom: "8px" }}>
                  {bucketLabels[bucket]}
                </div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: bucketColors[bucket], marginBottom: "4px" }}>
                  {data.count}
                </div>
                <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  {totalAmount > 0 ? ((data.amount / totalAmount) * 100).toFixed(1) : "0"}%
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)", marginTop: "8px" }}>
                  ${data.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "var(--background)",
              padding: "16px",
              borderRadius: "6px",
              border: "2px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--secondary)", marginBottom: "4px" }}>
              Total Outstanding
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>
              ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
            Aging Distribution
          </h4>

          {sortedBuckets.map(([bucket, data]) => {
            const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;

            return (
              <div key={bucket} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>{bucketLabels[bucket]}</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                    ${data.amount.toFixed(2)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "24px",
                    background: "var(--background)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: bucketColors[bucket],
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "12px",
            background: "#0066cc10",
            borderRadius: "4px",
            border: "1px solid #0066cc20",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>
            <strong>Total Items:</strong> {items.filter((i) => i.status !== "Paid").length} outstanding items
          </p>
        </div>
      </div>
    </div>
  );
}
