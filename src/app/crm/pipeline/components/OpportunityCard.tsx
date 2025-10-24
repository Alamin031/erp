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
    <motion.div 
      draggable 
      onDragStart={handleDragStart as unknown as any} 
      onMouseEnter={()=>setHover(true)} 
      onMouseLeave={()=>setHover(false)} 
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
      transition={{ duration: 0.2 }}
      style={{ 
        padding: 14, 
        borderRadius: 10, 
        background: 'var(--background)', 
        border: '1px solid var(--border)', 
        cursor: 'grab',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)', flex: 1 }}>{opportunity.name}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginLeft: 8 }}>${opportunity.value.toLocaleString()}</div>
      </div>
      
      <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 10, fontWeight: 500 }}>
        {opportunity.companyName || 'No company'}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          background: 'var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 700,
          fontSize: 12,
          color: 'white'
        }}>
          {initials}
        </div>
        <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 500 }}>
          {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>View Details</button>
      </div>
    </motion.div>
  );
}
