"use client";

import { Opportunity } from "@/types/opportunities";
import { motion } from "framer-motion";
import { OpportunityCard } from "./OpportunityCard";

interface Props { stage: string; opportunities: Opportunity[]; onDrop: (id: string) => void; onOpen?: (opp: Opportunity) => void }

export function StageColumn({ stage, opportunities = [], onDrop, onOpen }: Props) {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    const id = e.dataTransfer.getData('text/opportunity-id');
    if (id) onDrop(id);
  };

  const totalValue = opportunities.reduce((s,o)=>s+(o.value||0),0);

  return (
    <motion.div 
      onDragOver={handleDragOver} 
      onDrop={handleDrop} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ 
        background: 'var(--card-bg)', 
        border: '1px solid var(--border)', 
        borderRadius: 12, 
        padding: 16,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{stage}</div>
        <div style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 500 }}>
          {opportunities.length} {opportunities.length === 1 ? 'deal' : 'deals'} · ${totalValue.toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {opportunities.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 24, 
            color: 'var(--secondary)', 
            fontSize: 13,
            fontStyle: 'italic',
            textAlign: 'center',
            flex: 1
          }}>
            No opportunities
          </div>
        ) : (
          opportunities.map(o => (
            <OpportunityCard key={o.id} opportunity={o} onOpen={onOpen} />
          ))
        )}
      </div>
    </motion.div>
  );
}
