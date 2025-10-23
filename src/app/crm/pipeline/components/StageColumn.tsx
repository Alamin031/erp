"use client";

import { Opportunity } from "@/types/opportunities";
import { motion } from "framer-motion";
import { OpportunityCard } from "./OpportunityCard";

interface Props { stage: string; opportunities: Opportunity[]; onDrop: (id: string) => void }

export function StageColumn({ stage, opportunities = [], onDrop }: Props) {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    const id = e.dataTransfer.getData('text/opportunity-id');
    if (id) onDrop(id);
  };

  const totalValue = opportunities.reduce((s,o)=>s+(o.value||0),0);

  return (
    <motion.div onDragOver={handleDragOver} onDrop={handleDrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{stage}</div>
        <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{opportunities.length} deals · ${totalValue.toLocaleString()}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opportunities.map(o => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
    </motion.div>
  );
}
