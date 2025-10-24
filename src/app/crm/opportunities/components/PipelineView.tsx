"use client";

import { motion } from 'framer-motion';
import { Opportunity, StageName } from '@/types/opportunities';
import { useState } from 'react';

interface Props { byStage: Record<StageName, Opportunity[]>; onMove?: (id: string, stage: StageName) => void; onOpen?: (opp: Opportunity) => void }

export function PipelineView({ byStage, onMove, onOpen }: Props) {
  const stages = Object.keys(byStage) as StageName[];
  const [dragged, setDragged] = useState<Opportunity | null>(null);

  const handleDragStart = (opp: Opportunity) => setDragged(opp);
  const handleDrop = (stage: StageName) => { if (dragged) { onMove?.(dragged.id, stage); setDragged(null); } };

  return (
    <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(280px, 1fr)', gap: 16, paddingBottom: 8, minWidth: 'min-content' }}>
        {stages.map(stage => (
          <div 
            key={stage} 
            onDragOver={(e)=>e.preventDefault()} 
            onDrop={()=>handleDrop(stage)} 
            style={{ 
              background: 'var(--card)', 
              border: '1px solid var(--border)', 
              borderRadius: 12, 
              padding: 16, 
              minWidth: 280 
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px solid var(--border)'
            }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{stage}</h4>
              <span style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: 'var(--secondary)',
                background: 'var(--background)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                {byStage[stage]?.length || 0}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {byStage[stage]?.map(opp => (
                <motion.div 
                  key={opp.id} 
                  draggable 
                  onDragStart={()=>handleDragStart(opp)} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ 
                    padding: 14, 
                    borderRadius: 10, 
                    background: 'var(--background)', 
                    border: '1px solid var(--border)', 
                    cursor: 'grab',
                    transition: 'all 0.2s ease'
                  }} 
                  onClick={()=>onOpen?.(opp)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: 14,
                      color: 'var(--foreground)',
                      wordBreak: 'break-word',
                      lineHeight: 1.4
                    }}>
                      {opp.name}
                    </div>
                    <div style={{ 
                      color: 'var(--primary)', 
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      ${(opp.value||0).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: 'var(--secondary)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    gap: 8,
                    paddingTop: 8,
                    borderTop: '1px solid var(--border)'
                  }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      fontWeight: 500
                    }}>
                      {opp.companyName || 'No company'}
                    </div>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      opacity: 0.8
                    }}>
                      {opp.ownerName || 'Unassigned'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
