"use client";

import { motion } from "framer-motion";
import { Users, PieChart, TrendingUp, Coins } from "lucide-react";

interface OwnershipSummaryCardsProps {
  totalShareholders: number;
  totalSharesOutstanding: number;
  authorizedShares: number;
  fullyDilutedOwnership: number;
}

export function OwnershipSummaryCards({
  totalShareholders,
  totalSharesOutstanding,
  authorizedShares,
  fullyDilutedOwnership,
}: OwnershipSummaryCardsProps) {
  const cards = [
    {
      label: "Total Shareholders",
      value: totalShareholders,
      icon: Users,
      color: "#2563eb",
      iconColor: "rgba(37, 99, 235, 0.2)",
    },
    {
      label: "Total Shares Outstanding",
      value: totalSharesOutstanding.toLocaleString(),
      icon: PieChart,
      color: "#059669",
      iconColor: "rgba(5, 150, 105, 0.2)",
    },
    {
      label: "Authorized Shares",
      value: authorizedShares.toLocaleString(),
      icon: TrendingUp,
      color: "#f59e0b",
      iconColor: "rgba(245, 158, 11, 0.2)",
    },
    {
      label: "Fully Diluted Ownership %",
      value: `${fullyDilutedOwnership.toFixed(1)}%`,
      icon: Coins,
      color: "#8b5cf6",
      iconColor: "rgba(139, 92, 246, 0.2)",
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.label}
            variants={itemVariants}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}
            whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "100px",
                height: "100px",
                background: card.iconColor,
                borderRadius: "50%",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--secondary)", fontWeight: "500" }}>
                  {card.label}
                </span>
                <div
                  style={{
                    padding: "8px",
                    background: card.iconColor,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent size={20} color={card.color} />
                </div>
              </div>

              <div
                style={{
                  fontSize: "28px",
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
                {card.label === "Total Shareholders" && "Company shareholders"}
                {card.label === "Total Shares Outstanding" && "Issued shares"}
                {card.label === "Authorized Shares" && "Total authorized"}
                {card.label === "Fully Diluted Ownership %" && "All equity holders"}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
