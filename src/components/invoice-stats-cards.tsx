"use client";

import { motion } from "framer-motion";

interface InvoiceStatsCardsProps {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: number;
  averageInvoiceValue: number;
}

export function InvoiceStatsCards({
  totalInvoices,
  paidInvoices,
  unpaidInvoices,
  overdueInvoices,
  totalRevenue,
  pendingRevenue,
  monthlyRevenue,
  averageInvoiceValue,
}: InvoiceStatsCardsProps) {
  const cards = [
    {
      label: "Total Invoices",
      value: totalInvoices,
      icon: "📄",
      color: "#6c757d",
      subtext: `${paidInvoices} paid, ${unpaidInvoices} pending`,
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "#28a745",
      subtext: "From paid invoices",
    },
    {
      label: "Pending Payment",
      value: `$${pendingRevenue.toFixed(2)}`,
      icon: "⏱",
      color: "#ffc107",
      subtext: `${unpaidInvoices} invoices awaiting`,
    },
    {
      label: "Overdue",
      value: overdueInvoices,
      icon: "⚠️",
      color: "#dc3545",
      subtext: "Payment required",
    },
    {
      label: "This Month Revenue",
      value: `$${monthlyRevenue.toFixed(2)}`,
      icon: "📊",
      color: "#0066cc",
      subtext: "Current month earnings",
    },
    {
      label: "Avg Invoice Value",
      value: `$${averageInvoiceValue.toFixed(2)}`,
      icon: "📈",
      color: "#20c997",
      subtext: "Average per invoice",
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
      {cards.map(card => (
        <motion.div
          key={card.label}
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
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              background: `${card.color}10`,
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
                {card.label}
              </span>
              <span style={{ fontSize: "24px" }}>{card.icon}</span>
            </div>

            <div
              style={{
                fontSize: typeof card.value === "string" ? "24px" : "32px",
                fontWeight: "700",
                color: card.color,
                marginBottom: "8px",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              {card.subtext}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
