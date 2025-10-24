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
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(260px, 1fr)', gap: 12, paddingBottom: 8, minWidth: 'min-content' }}>
        {stages.map(stage => (
          <div key={stage} onDragOver={(e)=>e.preventDefault()} onDrop={()=>handleDrop(stage)} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, minWidth: 260 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{stage} ({byStage[stage]?.length||0})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {byStage[stage]?.map(opp => (
                <motion.div key={opp.id} draggable onDragStart={()=>handleDragStart(opp)} whileHover={{ scale: 1.02 }} style={{ padding: 12, borderRadius: 8, background: 'white', border: '1px solid var(--border)', cursor: 'grab' }} onClick={()=>onOpen?.(opp)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                    <div style={{ fontWeight: 700, wordBreak: 'break-word' }}>{opp.name}</div>
                    <div style={{ color: 'var(--secondary)', fontSize: 12, flexShrink: 0 }}>${(opp.value||0).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.companyName || '-'}</div>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.ownerName || '-'}</div>
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
