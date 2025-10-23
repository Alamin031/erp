"use client";

import { Opportunity } from "@/types/opportunities";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props { opportunity: Opportunity }

export function OpportunityCard({ opportunity }: Props) {
  const [hover, setHover] = useState(false);
  const initials = (opportunity.ownerName || 'U').split(' ').map(n=>n[0]).slice(0,2).join('');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/opportunity-id', opportunity.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div draggable onDragStart={handleDragStart as unknown as any} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} whileHover={{ scale: 1.02 }} style={{ padding: 10, borderRadius: 8, background: 'white', border: '1px solid var(--border)', cursor: 'grab' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontWeight: 700 }}>{opportunity.name}</div>
        <div style={{ fontSize: 12, color: 'var(--secondary)' }}>${opportunity.value.toLocaleString()}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <div>{opportunity.companyName || '-'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{initials}</div>
          <div>{opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString() : '-'}</div>
        </div>
      </div>
      {hover && <div style={{ marginTop: 8, textAlign: 'right' }}><button className="btn btn-secondary">View Details</button></div>}
    </motion.div>
  );
}
