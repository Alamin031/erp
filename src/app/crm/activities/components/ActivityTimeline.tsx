"use client";

import { Activity } from '@/types/activities';

interface Props { activities: Activity[] }

export function ActivityTimeline({ activities }: Props) {
  if (!activities || activities.length === 0) return <div style={{ color: 'var(--secondary)' }}>No activity timeline.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {activities.map(a => (
        <div key={a.id} style={{ padding: 8, borderRadius: 8, background: 'var(--background)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{a.type} — {a.contactName || a.companyName}</strong>
            <span style={{ color: 'var(--secondary)', fontSize: 12 }}>{new Date(a.dateTime).toLocaleString()}</span>
          </div>
          <div style={{ marginTop: 6 }}>{a.notes}</div>
        </div>
      ))}
    </div>
  );
}
