"use client";

import { useMemo } from "react";

interface CheckedOutGuest {
  id: string;
  guestName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  paymentMethod: string;
  baseCharge: number;
  additionalCharges: number;
  totalRevenue: number;
  isPaid: boolean;
}

interface PaymentSummaryProps {
  checkedOutGuests: CheckedOutGuest[];
}

export function PaymentSummary({ checkedOutGuests }: PaymentSummaryProps) {
  const summary = useMemo(() => {
    const totalCheckouts = checkedOutGuests.length;
    const totalRevenue = checkedOutGuests.reduce((sum, guest) => sum + guest.totalRevenue, 0);
    const paidRevenue = checkedOutGuests
      .filter(guest => guest.isPaid)
      .reduce((sum, guest) => sum + guest.totalRevenue, 0);
    const pendingPayments = totalRevenue - paidRevenue;
    const additionalChargesTotal = checkedOutGuests.reduce(
      (sum, guest) => sum + guest.additionalCharges,
      0
    );
    const paymentMethodBreakdown = {
      cash: checkedOutGuests.filter(g => g.paymentMethod === "Cash").length,
      card: checkedOutGuests.filter(g => g.paymentMethod === "Card").length,
      online: checkedOutGuests.filter(g => g.paymentMethod === "Online").length,
    };

    return {
      totalCheckouts,
      totalRevenue,
      paidRevenue,
      pendingPayments,
      additionalChargesTotal,
      paymentMethodBreakdown,
    };
  }, [checkedOutGuests]);

  const stats = [
    {
      label: "Total Checkouts",
      value: summary.totalCheckouts,
      color: "#0066cc",
      icon: "🏨",
    },
    {
      label: "Total Revenue",
      value: `$${summary.totalRevenue.toFixed(2)}`,
      color: "#28a745",
      icon: "💰",
    },
    {
      label: "Paid Payments",
      value: `$${summary.paidRevenue.toFixed(2)}`,
      color: "#17a2b8",
      icon: "✓",
    },
    {
      label: "Pending Payments",
      value: `$${summary.pendingPayments.toFixed(2)}`,
      color: "#ffc107",
      icon: "⏳",
    },
    {
      label: "Additional Charges",
      value: `$${summary.additionalChargesTotal.toFixed(2)}`,
      color: "#dc3545",
      icon: "📌",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="stat-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>
            Payment Method Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
              <span style={{ color: "var(--secondary)", fontSize: "14px" }}>💳 Card</span>
              <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                {summary.paymentMethodBreakdown.card}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
              <span style={{ color: "var(--secondary)", fontSize: "14px" }}>💵 Cash</span>
              <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                {summary.paymentMethodBreakdown.cash}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
              <span style={{ color: "var(--secondary)", fontSize: "14px" }}>🌐 Online</span>
              <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                {summary.paymentMethodBreakdown.online}
              </span>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>
            Daily Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                backgroundColor: "var(--background)",
                borderRadius: "4px",
              }}
            >
              <span style={{ color: "var(--secondary)", fontSize: "14px" }}>
                Completion Rate
              </span>
              <span style={{ fontWeight: "600", color: "var(--success)" }}>
                {summary.totalCheckouts > 0
                  ? `${Math.round((summary.paidRevenue / summary.totalRevenue) * 100)}%`
                  : "0%"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                backgroundColor: "var(--background)",
                borderRadius: "4px",
              }}
            >
              <span style={{ color: "var(--secondary)", fontSize: "14px" }}>
                Avg. Revenue/Guest
              </span>
              <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                {summary.totalCheckouts > 0
                  ? `$${(summary.totalRevenue / summary.totalCheckouts).toFixed(2)}`
                  : "$0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {checkedOutGuests.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>
            Recent Check-outs
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {checkedOutGuests.slice(0, 5).map(guest => (
              <div
                key={guest.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  backgroundColor: "var(--background)",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "var(--foreground)", fontWeight: "500" }}>
                  {guest.guestName}
                </span>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>{guest.paymentMethod}</span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: guest.isPaid ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    ${guest.totalRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
