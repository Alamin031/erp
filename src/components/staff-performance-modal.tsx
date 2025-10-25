"use client";

import { HousekeepingStaff } from "@/types/task";
import { motion } from "framer-motion";

interface StaffPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: HousekeepingStaff | null;
}

export function StaffPerformanceModal({
  isOpen,
  onClose,
  staff,
}: StaffPerformanceModalProps) {
  if (!isOpen || !staff) return null;

  const initials = staff.name.split(" ").map(n => n[0]).join("").toUpperCase();
  
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

  const statusColors = getStatusColor(staff.status);
  const completionRate = staff.tasksAssigned > 0 
    ? Math.round((staff.tasksCompleted / staff.tasksAssigned) * 100) 
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div
          className="modal-card"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ maxWidth: "600px" }}
        >
          <div className="modal-header">
            <h2>Staff Performance</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-form">
            {/* Staff Profile Header */}
            <motion.div 
              variants={itemVariants}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px",
                padding: "20px",
                background: "var(--background)",
                borderRadius: "8px",
                marginBottom: "20px"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "24px",
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "600" }}>
                  {staff.name}
                </h3>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: statusColors.bg,
                    color: statusColors.text,
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {statusColors.icon} {staff.status}
                </div>
              </div>
            </motion.div>

            {/* Performance Stats Grid */}
            <motion.div 
              variants={itemVariants}
              style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "12px",
                marginBottom: "20px"
              }}
            >
              <div style={{
                padding: "16px",
                background: "var(--background)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ 
                  fontSize: "12px", 
                  color: "var(--secondary)", 
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Tasks Assigned
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "700", 
                  color: "var(--primary)",
                  margin: 0
                }}>
                  {staff.tasksAssigned}
                </p>
              </div>

              <div style={{
                padding: "16px",
                background: "var(--background)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ 
                  fontSize: "12px", 
                  color: "var(--secondary)", 
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Completed
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "700", 
                  color: "var(--success)",
                  margin: 0
                }}>
                  {staff.tasksCompleted}
                </p>
              </div>

              <div style={{
                padding: "16px",
                background: "var(--background)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ 
                  fontSize: "12px", 
                  color: "var(--secondary)", 
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Avg. Time Per Task
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "700", 
                  color: "var(--foreground)",
                  margin: 0
                }}>
                  {staff.averageTimePerTask}m
                </p>
              </div>

              <div style={{
                padding: "16px",
                background: "var(--background)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ 
                  fontSize: "12px", 
                  color: "var(--secondary)", 
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Completion Rate
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "700", 
                  color: completionRate >= 80 ? "var(--success)" : completionRate >= 60 ? "var(--warning)" : "var(--danger)",
                  margin: 0
                }}>
                  {completionRate}%
                </p>
              </div>
            </motion.div>

            {/* Completion Progress Bar */}
            <motion.div variants={itemVariants} style={{ marginBottom: "20px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <p style={{ 
                  fontSize: "13px", 
                  color: "var(--secondary)",
                  margin: 0,
                  fontWeight: "600"
                }}>
                  Task Completion Progress
                </p>
                <p style={{ 
                  fontSize: "13px", 
                  fontWeight: "600",
                  color: "var(--foreground)",
                  margin: 0
                }}>
                  {staff.tasksCompleted} / {staff.tasksAssigned}
                </p>
              </div>
              <div style={{
                width: "100%",
                height: "12px",
                background: "var(--background)",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: completionRate >= 80 
                      ? "var(--success)" 
                      : completionRate >= 60 
                      ? "var(--warning)" 
                      : "var(--danger)",
                  }}
                />
              </div>
            </motion.div>

            {/* Performance Insights */}
            <motion.div variants={itemVariants}>
              <p style={{ 
                fontSize: "13px", 
                color: "var(--secondary)",
                marginBottom: "12px",
                fontWeight: "600"
              }}>
                Performance Insights
              </p>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "8px"
              }}>
                {completionRate >= 90 && (
                  <div style={{
                    padding: "12px",
                    background: "rgba(40, 167, 69, 0.1)",
                    border: "1px solid rgba(40, 167, 69, 0.3)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--success)",
                  }}>
                    ✓ Excellent performance! Completion rate above 90%
                  </div>
                )}
                {staff.averageTimePerTask <= 30 && (
                  <div style={{
                    padding: "12px",
                    background: "rgba(40, 167, 69, 0.1)",
                    border: "1px solid rgba(40, 167, 69, 0.3)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--success)",
                  }}>
                    ✓ Fast worker! Average time under 30 minutes
                  </div>
                )}
                {completionRate < 60 && (
                  <div style={{
                    padding: "12px",
                    background: "rgba(255, 193, 7, 0.1)",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--warning)",
                  }}>
                    ⚠ Needs improvement: Completion rate below 60%
                  </div>
                )}
                {staff.tasksAssigned - staff.tasksCompleted > 5 && (
                  <div style={{
                    padding: "12px",
                    background: "rgba(13, 110, 253, 0.1)",
                    border: "1px solid rgba(13, 110, 253, 0.3)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--primary)",
                  }}>
                    ℹ {staff.tasksAssigned - staff.tasksCompleted} tasks still pending
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="modal-actions" style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
