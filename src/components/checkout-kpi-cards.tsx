"use client";

import { motion } from "framer-motion";

interface CheckoutKPICardsProps {
  totalDeparturestoday: number;
  completedCheckouts: number;
  pendingCheckouts: number;
}

export function CheckoutKPICards({
  totalDeparturestoday,
  completedCheckouts,
  pendingCheckouts,
}: CheckoutKPICardsProps) {
  const cards = [
    {
      label: "Total Departures Today",
      value: totalDeparturestoday,
      color: "#0066cc",
      icon: "📤",
    },
    {
      label: "Completed Check-outs",
      value: completedCheckouts,
      color: "#28a745",
      icon: "✓",
    },
    {
      label: "Pending Check-outs",
      value: pendingCheckouts,
      color: "#ffc107",
      icon: "⏳",
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

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="stat-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ marginBottom: "32px" }}
    >
      {cards.map((card, index) => (
        <motion.div key={index} className="stat-card" variants={cardVariants}>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>
            {card.icon}
          </div>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value" style={{ color: card.color }}>
            {card.value}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
