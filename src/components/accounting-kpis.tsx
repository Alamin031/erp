"use client";

import { motion } from "framer-motion";

interface AccountingKpisProps {
  arOutstanding: number;
  apOutstanding: number;
  cashOnHand: number;
  overdueCount: number;
  overdueAmount: number;
  netCashflow: number;
  onKpiClick?: (type: string) => void;
}

export function AccountingKpis({
  arOutstanding,
  apOutstanding,
  cashOnHand,
  overdueCount,
  overdueAmount,
  netCashflow,
  onKpiClick,
}: AccountingKpisProps) {
  const kpis = [
    {
      label: "AR Outstanding",
      value: `$${arOutstanding.toFixed(2)}`,
      icon: "📊",
      color: "#0066cc",
      subtext: "Accounts Receivable",
      onClick: () => onKpiClick?.("ar"),
    },
    {
      label: "AP Outstanding",
      value: `$${apOutstanding.toFixed(2)}`,
      icon: "💳",
      color: "#ffc107",
      subtext: "Accounts Payable",
      onClick: () => onKpiClick?.("ap"),
    },
    {
      label: "Cash on Hand",
      value: `$${cashOnHand.toFixed(2)}`,
      icon: "💰",
      color: "#28a745",
      subtext: "Bank Balance",
      onClick: () => onKpiClick?.("cash"),
    },
    {
      label: "Overdue Receivables",
      value: overdueCount,
      icon: "⚠️",
      color: "#dc3545",
      subtext: `${overdueAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}`,
      onClick: () => onKpiClick?.("overdue"),
    },
    {
      label: "Net Cashflow",
      value: `$${netCashflow.toFixed(2)}`,
      icon: "📈",
      color: netCashflow >= 0 ? "#28a745" : "#dc3545",
      subtext: netCashflow >= 0 ? "Positive" : "Negative",
      onClick: () => onKpiClick?.("cashflow"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {kpis.map(kpi => (
        <motion.div
          key={kpi.label}
          variants={itemVariants}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          onClick={kpi.onClick}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              background: `${kpi.color}10`,
              borderRadius: "50%",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "14px", color: "var(--secondary)" }}>
                {kpi.label}
              </span>
              <span style={{ fontSize: "24px" }}>{kpi.icon}</span>
            </div>

            <div
              style={{
                fontSize: typeof kpi.value === "string" ? "24px" : "32px",
                fontWeight: "700",
                color: kpi.color,
                marginBottom: "8px",
              }}
            >
              {kpi.value}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              {kpi.subtext}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
