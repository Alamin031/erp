"use client";

import { motion } from "framer-motion";
import { OwnershipChange } from "@/types/cap-table";
import { TrendingUp, ArrowRight, Zap } from "lucide-react";

interface CapTableTimelineProps {
  ownershipHistory: OwnershipChange[];
}

const typeIcons: Record<string, React.ReactNode> = {
  Issuance: <TrendingUp size={16} />,
  Transfer: <ArrowRight size={16} />,
  Cancellation: <Zap size={16} />,
  Conversion: <ArrowRight size={16} />,
  Split: <TrendingUp size={16} />,
};

const typeColors: Record<string, string> = {
  Issuance: "#059669",
  Transfer: "#2563eb",
  Cancellation: "#dc3545",
  Conversion: "#f59e0b",
  Split: "#8b5cf6",
};

export function CapTableTimeline({ ownershipHistory }: CapTableTimelineProps) {
  if (ownershipHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          No ownership changes recorded yet.
        </p>
      </motion.div>
    );
  }

  const sortedHistory = [...ownershipHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Cap Table Timeline
      </h3>

      <div style={{ position: "relative", paddingLeft: "40px" }}>
        {/* Timeline line */}
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "linear-gradient(to bottom, var(--border), transparent)",
          }}
        />

        {/* Timeline items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sortedHistory.map((item, idx) => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            const color = typeColors[item.type] || "#6b7280";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  display: "flex",
                  gap: "16px",
                  position: "relative",
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "8px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: color,
                    border: "3px solid var(--card-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    zIndex: 10,
                  }}
                >
                  {typeIcons[item.type] || <TrendingUp size={12} />}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: `${color}10`,
                    border: `1px solid ${color}20`,
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                        {item.type}
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>
                        {item.shareholderName}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: color,
                          marginBottom: "2px",
                        }}
                      >
                        {item.sharesQuantity.toLocaleString()} shares
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--secondary)" }}>
                        {item.equityClass}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--secondary)" }}>
                    {item.details}
                  </p>

                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: `1px solid ${color}20`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "var(--secondary)" }}>
                      {dateStr} at {timeStr}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--secondary)" }}>
                      By {item.user}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
