"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, XCircle, Users } from "lucide-react";

interface LeadsStatsCardsProps {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  totalValue: number;
}

export function LeadsStatsCards({
  totalLeads,
  qualifiedLeads,
  convertedLeads,
  lostLeads,
  conversionRate,
  totalValue,
}: LeadsStatsCardsProps) {
  const cards = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "#2563eb",
      iconColor: "rgba(37, 99, 235, 0.2)",
    },
    {
      label: "Qualified Leads",
      value: qualifiedLeads,
      icon: TrendingUp,
      color: "#f59e0b",
      iconColor: "rgba(245, 158, 11, 0.2)",
    },
    {
      label: "Converted Leads",
      value: convertedLeads,
      icon: CheckCircle,
      color: "#059669",
      iconColor: "rgba(5, 150, 105, 0.2)",
    },
    {
      label: "Lost Leads",
      value: lostLeads,
      icon: XCircle,
      color: "#dc3545",
      iconColor: "rgba(220, 53, 69, 0.2)",
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
    <>
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
                  {card.label === "Total Leads" && `${((convertedLeads / totalLeads) * 100 || 0).toFixed(1)}% converted`}
                  {card.label === "Qualified Leads" && `${((qualifiedLeads / totalLeads) * 100 || 0).toFixed(1)}% of total`}
                  {card.label === "Converted Leads" && `${conversionRate.toFixed(1)}% conversion rate`}
                  {card.label === "Lost Leads" && `${((lostLeads / totalLeads) * 100 || 0).toFixed(1)}% lost rate`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional metrics row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
          <span style={{ fontSize: "12px", color: "var(--secondary)", fontWeight: "500" }}>Conversion Rate</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)", marginTop: "8px" }}>
            {conversionRate.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
          <span style={{ fontSize: "12px", color: "var(--secondary)", fontWeight: "500" }}>Total Pipeline Value</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#059669", marginTop: "8px" }}>
            ${(totalValue / 1000).toFixed(0)}K
          </div>
        </div>
      </motion.div>
    </>
  );
}
