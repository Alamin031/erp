"use client";

import { StageName } from '@/types/opportunities';

interface Props { stages: StageName[]; current: StageName }

export function StageProgress({ stages, current }: Props) {
  const idx = stages.indexOf(current);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {stages.map((s,i)=> (
        <div key={s} style={{ flex: 1 }}>
          <div style={{ height: 8, background: i<=idx ? 'var(--primary)' : 'var(--border)', borderRadius: 999 }} />
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 6 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}
