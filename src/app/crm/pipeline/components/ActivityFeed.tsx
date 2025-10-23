"use client";

import { usePipeline } from '@/store/usePipeline';

export function ActivityFeed() {
  const { activity } = usePipeline();
  if (!activity || activity.length === 0) return <div style={{ color: 'var(--secondary)' }}>No activity yet.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {activity.slice(0,20).map(a => (
        <div key={a.id} style={{ padding: 8, background: 'var(--background)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{a.text}</div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{new Date(a.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
