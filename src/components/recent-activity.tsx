"use client";

import { ActivityLog } from "@/types/task";
import { motion } from "framer-motion";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return "✨";
      case "assigned":
        return "👤";
      case "updated":
        return "✏️";
      case "completed":
        return "✅";
      case "reopened":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "#0066cc";
      case "assigned":
        return "#17a2b8";
      case "updated":
        return "#ffc107";
      case "completed":
        return "#28a745";
      case "reopened":
        return "#fd7e14";
      default:
        return "#6c757d";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Recent Activity
      </h3>

      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {activities.length > 0 ? (
          activities.slice(0, 10).map(activity => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              style={{
                padding: "12px",
                background: "var(--background)",
                border: `2px solid ${getActionColor(activity.action)}20`,
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{getActionIcon(activity.action)}</span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      color: "var(--foreground)",
                      fontWeight: "500",
                    }}
                  >
                    Room {activity.roomNumber}{" "}
                    <span style={{ color: getActionColor(activity.action) }}>
                      {activity.action}
                    </span>
                  </p>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      color: "var(--secondary)",
                      fontSize: "12px",
                    }}
                  >
                    by {activity.staffName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--secondary)",
                      fontSize: "11px",
                    }}
                  >
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "var(--secondary)",
              fontSize: "13px",
            }}
          >
            No activity yet
          </div>
        )}
      </motion.div>
    </div>
  );
}
