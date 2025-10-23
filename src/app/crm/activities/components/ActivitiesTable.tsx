"use client";

import { Activity } from '@/types/activities';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface Props { activities: Activity[]; onView?: (a: Activity)=>void; onEdit?: (a: Activity)=>void; onDelete?: (id: string)=>void; onMarkCompleted?: (id: string)=>void }

export function ActivitiesTable({ activities, onView, onEdit, onDelete, onMarkCompleted }: Props) {
  if (!activities || activities.length === 0) return <div style={{ color: 'var(--secondary)' }}>No activities found.</div>;

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: 12 }}>ID</th>
            <th style={{ padding: 12 }}>Type</th>
            <th style={{ padding: 12 }}>Contact</th>
            <th style={{ padding: 12 }}>Company</th>
            <th style={{ padding: 12 }}>Owner</th>
            <th style={{ padding: 12 }}>Date/Time</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 12 }}>{a.id}</td>
              <td style={{ padding: 12 }}>{a.type}</td>
              <td style={{ padding: 12 }}>{a.contactName || '-'}</td>
              <td style={{ padding: 12 }}>{a.companyName || '-'}</td>
              <td style={{ padding: 12 }}>{a.ownerName || '-'}</td>
              <td style={{ padding: 12 }}>{new Date(a.dateTime).toLocaleString()}</td>
              <td style={{ padding: 12 }}>{a.status}</td>
              <td style={{ padding: 12 }}>
                <button onClick={()=>onView?.(a)} style={{ marginRight: 8 }}><Eye size={14} /></button>
                <button onClick={()=>onEdit?.(a)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                <button onClick={()=>onMarkCompleted?.(a.id)} style={{ marginRight: 8 }}>Complete</button>
                <button onClick={()=>onDelete?.(a.id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
