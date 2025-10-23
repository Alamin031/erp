"use client";

import { useMemo, useState, useEffect } from 'react';
import { useNotes } from '@/store/useNotes';

export function ActivityTimeline() {
  const log = useNotes(s => s.log);
  const [filterType, setFilterType] = useState<'All'|'Contact'|'Company'|'Deal'>('All');

  const entries = useMemo(()=> log.filter(l => (filterType === 'All' || l.entityType === filterType)).sort((a,b)=> new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [log, filterType]);

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Activity</h4>
        <select className="form-input" value={filterType} onChange={(e)=>setFilterType(e.target.value as any)} style={{ width: 140 }}>
          <option value="All">All</option>
          <option value="Contact">Contact</option>
          <option value="Company">Company</option>
          <option value="Deal">Deal</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        {entries.map(e=> (
          <div key={e.id} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
            <div style={{ fontSize: 13 }}>{e.text}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(e.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
