"use client";

import { HousekeepingStaff } from "@/types/task";
import { motion } from "framer-motion";

interface StaffListProps {
  staff: HousekeepingStaff[];
  onViewPerformance?: (staffId: string) => void;
}

export function StaffList({ staff, onViewPerformance }: StaffListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "rgba(40, 167, 69, 0.1)", text: "var(--success)", icon: "🟢" };
      case "Off Duty":
        return { bg: "rgba(220, 53, 69, 0.1)", text: "var(--danger)", icon: "🔴" };
      case "On Break":
        return { bg: "rgba(255, 193, 7, 0.1)", text: "var(--warning)", icon: "🟡" };
      default:
        return { bg: "rgba(108, 117, 125, 0.1)", text: "var(--secondary)", icon: "⚪" };
    }
  };

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
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "16px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {staff.map(member => {
        const statusColors = getStatusColor(member.status);
        const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase();

        return (
          <motion.div
            key={member.id}
            variants={itemVariants}
            style={{
              padding: "16px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600" }}>
                  {member.name}
                </h4>
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    background: statusColors.bg,
                    color: statusColors.text,
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {statusColors.icon} {member.status}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "var(--secondary)" }}>Tasks Assigned</span>
                <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                  {member.tasksAssigned}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "var(--secondary)" }}>Completed</span>
                <span style={{ fontWeight: "600", color: "var(--success)" }}>
                  {member.tasksCompleted}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "var(--secondary)" }}>Avg. Time</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  {member.averageTimePerTask}m
                </span>
              </div>
            </div>

            <button
              onClick={() => onViewPerformance?.(member.id)}
              style={{
                width: "100%",
                padding: "8px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              View Performance
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
