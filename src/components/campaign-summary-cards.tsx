"use client";

import { motion } from "framer-motion";
import { Target, DollarSign, TrendingUp, PieChart } from "lucide-react";

interface CampaignSummaryCardsProps {
  activeCampaigns: number;
  totalBudget: number;
  avgCTR: number;
  avgROI: number;
}

export function CampaignSummaryCards({
  activeCampaigns,
  totalBudget,
  avgCTR,
  avgROI,
}: CampaignSummaryCardsProps) {
  const cards = [
    {
      label: "Active Campaigns",
      value: activeCampaigns,
      icon: Target,
      color: "#2563eb",
      iconColor: "rgba(37, 99, 235, 0.2)",
    },
    {
      label: "Total Budget",
      value: `$${totalBudget.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "#059669",
      iconColor: "rgba(5, 150, 105, 0.2)",
    },
    {
      label: "Avg CTR",
      value: `${avgCTR.toFixed(2)}%`,
      icon: TrendingUp,
      color: "#f59e0b",
      iconColor: "rgba(245, 158, 11, 0.2)",
    },
    {
      label: "Avg ROI",
      value: `${avgROI.toFixed(0)}%`,
      icon: PieChart,
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
                {card.label === "Active Campaigns" && "Currently running"}
                {card.label === "Total Budget" && "Total allocated"}
                {card.label === "Avg CTR" && "Click-through rate"}
                {card.label === "Avg ROI" && "Return on investment"}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
