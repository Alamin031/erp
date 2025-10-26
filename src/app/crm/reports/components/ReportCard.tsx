"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  color?: string;
  bgColor?: string;
}

export function ReportCard({ label, value, Icon, color = "var(--primary)", bgColor = "rgba(74,158,255,0.1)" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 20, borderRadius: 12, backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--secondary)", marginBottom: 4, fontWeight: 500 }}>{label}</p>
        <div style={{ padding: 8, borderRadius: 8, backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: 24, fontWeight: 700, color: "var(--foreground)" }}>{typeof value === "number" ? value : value}</p>
    </motion.div>
  );
}
