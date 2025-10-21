"use client";

import { Task } from "@/types/task";
import { motion } from "framer-motion";

interface TaskStatsCardsProps {
  tasks: Task[];
}

export function TaskStatsCards({ tasks }: TaskStatsCardsProps) {
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const urgentTasks = tasks.filter(t => t.priority === "High" && t.status !== "Completed").length;
  const maintenanceTasks = tasks.filter(t => t.taskType === "Maintenance").length;

  const cards = [
    {
      label: "Pending Tasks",
      value: pendingTasks,
      color: "#ffc107",
      icon: "📋",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      color: "#28a745",
      icon: "✅",
    },
    {
      label: "Maintenance Requests",
      value: maintenanceTasks,
      color: "#17a2b8",
      icon: "🔧",
    },
    {
      label: "Urgent Tasks",
      value: urgentTasks,
      color: "#dc3545",
      icon: "🚨",
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
