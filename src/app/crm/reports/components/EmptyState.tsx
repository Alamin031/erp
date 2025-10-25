"use client";

import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "60px 40px",
        textAlign: "center",
        backgroundColor: "var(--card-bg)",
        borderRadius: 8,
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "16px",
            borderRadius: 12,
            backgroundColor: "rgba(74, 158, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart3 size={32} style={{ color: "var(--primary)" }} />
        </div>
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: 8 }}>No Report Data Available</h3>
      <p style={{ color: "var(--secondary)", fontSize: "14px", marginBottom: 24 }}>
        No report data available for the selected period. Try adjusting your filters to see different results.
      </p>
      <button
        onClick={onClearFilters}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          backgroundColor: "var(--primary)",
          color: "#fff",
          fontWeight: 500,
          fontSize: "14px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0052a3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
      >
        Clear Filters
      </button>
    </motion.div>
  );
}
