"use client";

import { Bill } from "@/types/bills";
import { motion } from "framer-motion";
import { DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props { bills: Bill[] }

export function BillsStatsCards({ bills }: Props) {
  const totalBills = bills.length;
  const totalPaid = bills.reduce((s, b) => s + (b.status === "Paid" ? b.amount : 0), 0);
  const totalPending = bills.filter((b) => b.status !== "Paid").reduce((s, b) => s + b.balance, 0);
  const overdue = bills.filter((b) => b.status === "Overdue").length;

  const cards = [
    { label: "Total Bills", value: totalBills, color: "#1d4ed8", icon: <DollarSign size={20} /> },
    { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, color: "#0f766e", icon: <CheckCircle2 size={20} /> },
    { label: "Total Pending", value: `$${totalPending.toFixed(2)}`, color: "#a16207", icon: <Clock size={20} /> },
    { label: "Overdue Bills", value: overdue, color: "#b91c1c", icon: <AlertTriangle size={20} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {cards.map((c) => (
        <motion.div key={c.label} whileHover={{ scale: 1.01 }} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: c.color + '20', color: c.color, display: 'grid', placeItems: 'center' }}>{c.icon}</div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{c.label}</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{c.value}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
