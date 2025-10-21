"use client";

import { Invoice } from "@/types/invoice";

interface RevenueChartProps {
  invoices: Invoice[];
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      fullMonth: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      date,
      paid: 0,
      pending: 0,
    };
  });

  invoices.forEach(inv => {
    const invDate = new Date(inv.issueDate);
    const monthIndex = last12Months.findIndex(
      m => m.date.getMonth() === invDate.getMonth() && m.date.getFullYear() === invDate.getFullYear()
    );

    if (monthIndex >= 0) {
      if (inv.status === "Paid") {
        last12Months[monthIndex].paid += inv.totalAmount;
      } else {
        last12Months[monthIndex].pending += inv.totalAmount;
      }
    }
  });

  const maxAmount = Math.max(
    ...last12Months.flatMap(m => [m.paid, m.pending])
  );

  const totalPaid = last12Months.reduce((sum, m) => sum + m.paid, 0);
  const totalPending = last12Months.reduce((sum, m) => sum + m.pending, 0);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        12-Month Revenue Overview
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", gap: "24px", height: "220px", alignItems: "flex-end" }}>
          {last12Months.map((month, idx) => {
            const total = month.paid + month.pending;
            const maxBarHeight = 200;
            const paidHeight = (month.paid / maxAmount) * maxBarHeight;
            const pendingHeight = (month.pending / maxAmount) * maxBarHeight;

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: `${maxBarHeight}px`,
                    alignItems: "flex-end",
                    gap: "2px",
                  }}
                  title={`Paid: $${month.paid.toFixed(0)}, Pending: $${month.pending.toFixed(0)}`}
                >
                  {paidHeight > 0 && (
                    <div
                      style={{
                        flex: 1,
                        height: `${paidHeight}px`,
                        background: "#28a745",
                        borderRadius: "4px 4px 0 0",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.opacity = "0.8";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                    />
                  )}
                  {pendingHeight > 0 && (
                    <div
                      style={{
                        flex: 1,
                        height: `${pendingHeight}px`,
                        background: "#ffc107",
                        borderRadius: "4px 4px 0 0",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.opacity = "0.8";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                    />
                  )}
                </div>
                <span style={{ fontSize: "11px", color: "var(--secondary)", fontWeight: "500" }}>
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            style={{
              padding: "12px",
              background: "var(--background)",
              borderRadius: "6px",
              borderLeft: "4px solid #28a745",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
              Total Paid Revenue
            </p>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#28a745" }}>
              ${totalPaid.toFixed(2)}
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              background: "var(--background)",
              borderRadius: "6px",
              borderLeft: "4px solid #ffc107",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
              Total Pending Revenue
            </p>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#ffc107" }}>
              ${totalPending.toFixed(2)}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: "#28a745",
              }}
            />
            <span style={{ color: "var(--foreground)" }}>Paid</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: "#ffc107",
              }}
            />
            <span style={{ color: "var(--foreground)" }}>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
