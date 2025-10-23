"use client";

import { useLeads } from "@/store/useLeads";

interface Props { limit?: number }

export function LeadsActivityLog({ limit = 20 }: Props) {
  const { getRecentActivity } = useLeads();
  const items = getRecentActivity(limit);

  if (items.length === 0) {
    return <div style={{ color: "var(--secondary)", fontSize: 13 }}>No recent activity</div>;
  }

  return (
    <div className="activity-list" role="list">
      {items.map((a) => (
        <div key={a.id} className="activity-item" role="listitem">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <strong>{a.type.replace(/_/g, " ")}</strong>
            <span style={{ fontSize: 12, color: "var(--secondary)" }}>{new Date(a.timestamp).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 13 }}>
            {a.leadName}: {a.details}
          </div>
        </div>
      ))}
    </div>
  );
}
