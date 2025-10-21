"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, Calendar, AlertCircle } from "lucide-react";
import { Rate, PriceAdjustment } from "@/types/rates";

interface RatesSummaryCardsProps {
  rates: Rate[];
  adjustmentQueue: PriceAdjustment[];
}

export function RatesSummaryCards({ rates, adjustmentQueue }: RatesSummaryCardsProps) {
  const activeRates = rates.filter((r) => r.status === "Active");
  const baseRates = rates.filter((r) => r.rateType === "Base" && r.status === "Active");
  const averageBaseRate =
    baseRates.length > 0
      ? baseRates.reduce((sum, r) => sum + r.basePrice, 0) / baseRates.length
      : 0;

  const activePromotions = rates.filter((r) => r.rateType === "Promo" && r.status === "Active");
  const pendingApprovals = adjustmentQueue.filter((a) => a.approvalStatus === "Pending");

  const cards = [
    {
      label: "Current Base Rate",
      value: `$${averageBaseRate.toFixed(2)}`,
      icon: DollarSign,
      color: "#059669",
      iconColor: "rgba(5, 150, 105, 0.2)",
      subtext: `${baseRates.length} base rates`,
    },
    {
      label: "Active Promotions",
      value: activePromotions.length,
      icon: Zap,
      color: "#f59e0b",
      iconColor: "rgba(245, 158, 11, 0.2)",
      subtext: "Currently running",
    },
    {
      label: "Occupancy-Sensitive Rates",
      value: "Enabled",
      icon: Calendar,
      color: "#2563eb",
      iconColor: "rgba(37, 99, 235, 0.2)",
      subtext: `${activeRates.length} active rates`,
    },
    {
      label: "Pending Approvals",
      value: pendingApprovals.length,
      icon: AlertCircle,
      color: pendingApprovals.length > 0 ? "#dc3545" : "#6b7280",
      iconColor:
        pendingApprovals.length > 0
          ? "rgba(220, 53, 69, 0.2)"
          : "rgba(107, 114, 128, 0.2)",
      subtext: "Awaiting approval",
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
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
        );
      })}
    </motion.div>
  );
}
