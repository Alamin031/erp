"use client";

import { Task } from "@/types/task";
import { motion } from "framer-motion";

interface TaskPriorityChartProps {
  tasks: Task[];
}

export function TaskPriorityChart({ tasks }: TaskPriorityChartProps) {
  const highPriority = tasks.filter(t => t.priority === "High").length;
  const mediumPriority = tasks.filter(t => t.priority === "Medium").length;
  const lowPriority = tasks.filter(t => t.priority === "Low").length;
  const total = highPriority + mediumPriority + lowPriority;

  const highPercent = total > 0 ? (highPriority / total) * 100 : 0;
  const mediumPercent = total > 0 ? (mediumPriority / total) * 100 : 0;
  const lowPercent = total > 0 ? (lowPriority / total) * 100 : 0;

  const conic = `conic-gradient(
    #dc3545 0deg ${highPercent * 3.6}deg,
    #ffc107 ${highPercent * 3.6}deg ${(highPercent + mediumPercent) * 3.6}deg,
    #28a745 ${(highPercent + mediumPercent) * 3.6}deg 360deg
  )`;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      style={{
        padding: "24px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Task Priority Distribution
      </h3>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <div style={{ position: "relative", width: "150px", height: "150px" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: conic,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--card-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontSize: "13px",
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--foreground)" }}>
                {total}
              </div>
              <div style={{ fontSize: "11px", color: "var(--secondary)" }}>
                Total Tasks
              </div>
            </div>
          </div>
        </div>

        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#dc3545",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                High Priority
              </div>
              <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {highPriority} tasks ({highPercent.toFixed(1)}%)
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#ffc107",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                Medium Priority
              </div>
              <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {mediumPriority} tasks ({mediumPercent.toFixed(1)}%)
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#28a745",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                Low Priority
              </div>
              <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {lowPriority} tasks ({lowPercent.toFixed(1)}%)
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
