"use client";

import { useContacts } from "@/store/useContacts";

interface Props { limit?: number }

export function ActivityLog({ limit = 20 }: Props) {
  const { getRecentActivity } = useContacts();
  const items = getRecentActivity(limit);

  if (!items || items.length === 0) return <div style={{ color: 'var(--secondary)' }}>No recent activity.</div>;

  return (
    <div className="activity-list">
      {items.map(a => (
        <div key={a.id} className="activity-item">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{a.type}</strong>
            <span style={{ color: 'var(--secondary)', fontSize: 12 }}>{new Date(a.timestamp).toLocaleString()}</span>
          </div>
          <div style={{ marginTop: 6 }}>{a.contactName}: {a.details}</div>
        </div>
      ))}
    </div>
  );
}
