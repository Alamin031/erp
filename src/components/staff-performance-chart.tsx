"use client";

import { HousekeepingStaff } from "@/types/task";
import { motion } from "framer-motion";

interface StaffPerformanceChartProps {
  staff: HousekeepingStaff[];
}

export function StaffPerformanceChart({ staff }: StaffPerformanceChartProps) {
  const maxCompleted = Math.max(...staff.map(s => s.tasksCompleted));
  const maxTime = Math.max(...staff.map(s => s.averageTimePerTask));

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Staff Performance
      </h3>

      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {staff.map(member => (
          <motion.div key={member.id} variants={itemVariants}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                {member.name}
              </span>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {member.tasksCompleted} completed
              </span>
            </div>

            <div
              style={{
                height: "20px",
                background: "var(--background)",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "4px",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(member.tasksCompleted / maxCompleted) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #0066cc, #4a9eff)",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--secondary)" }}>
              <span>Avg. time: {member.averageTimePerTask}m</span>
              <span>Pending: {member.tasksAssigned}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
