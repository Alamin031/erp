"use client";

import { Task, HousekeepingStaff } from "@/types/task";
import { motion } from "framer-motion";
import { useToast } from "./toast";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  staff: HousekeepingStaff[];
  onMarkComplete?: (taskId: string) => void;
  onReopen?: (taskId: string) => void;
}

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  staff,
  onMarkComplete,
  onReopen,
}: TaskDetailsModalProps) {
  const { showToast } = useToast();

  if (!isOpen || !task) return null;

  const assignedStaff = staff.find(s => s.id === task.assignedStaffId);

  const handleMarkComplete = () => {
    onMarkComplete?.(task.id);
    showToast("Task marked as complete", "success");
    onClose();
  };

  const handleReopen = () => {
    onReopen?.(task.id);
    showToast("Task reopened", "info");
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "var(--danger)";
      case "Medium":
        return "var(--warning)";
      case "Low":
        return "var(--success)";
      default:
        return "var(--secondary)";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "var(--success)";
      case "In Progress":
        return "var(--primary)";
      case "Pending":
        return "var(--warning)";
      default:
        return "var(--secondary)";
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
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div
        className="modal"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="modal-header">
          <h2>Task Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="details-section">
              <p className="details-title">Task ID</p>
              <p style={{ fontSize: "14px", color: "var(--primary)", fontWeight: "600" }}>
                {task.id}
              </p>
            </div>

            <div className="details-section">
              <p className="details-title">Room Number</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--foreground)" }}>
                {task.roomNumber}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="details-section">
            <p className="details-title">Task Type</p>
            <p style={{ fontSize: "14px", color: "var(--foreground)" }}>
              {task.taskType}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="details-section">
            <p className="details-title">Description</p>
            <p style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: "1.6" }}>
              {task.description}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="details-section">
              <p className="details-title">Priority</p>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                  color: getPriorityColor(task.priority),
                }}
              >
                {task.priority}
              </span>
            </div>

            <div className="details-section">
              <p className="details-title">Status</p>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: `${getStatusColor(task.status)}20`,
                  color: getStatusColor(task.status),
                }}
              >
                {task.status}
              </span>
            </div>

            <div className="details-section">
              <p className="details-title">Assigned Staff</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                {assignedStaff?.name || "Unassigned"}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="details-section">
              <p className="details-title">Due Date & Time</p>
              <p style={{ fontSize: "14px", color: "var(--foreground)" }}>
                {new Date(task.dueDate).toLocaleDateString()} at {task.dueTime}
              </p>
            </div>

            <div className="details-section">
              <p className="details-title">Created</p>
              <p style={{ fontSize: "14px", color: "var(--secondary)" }}>
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: "24px" }}>
            <p className="details-title" style={{ marginBottom: "16px" }}>
              Task Timeline
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                  }}
                />
                <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                  Created: {new Date(task.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {task.assignedAt && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary)",
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                    Assigned: {new Date(task.assignedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {task.completedAt && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--success)",
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                    Completed: {new Date(task.completedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="modal-actions" style={{ marginTop: "32px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {task.status !== "Completed" ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleMarkComplete}
              >
                Mark Complete
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReopen}
              >
                Reopen Task
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
