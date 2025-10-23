import { Opportunity } from '@/types/opportunities';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface Props { opportunities: Opportunity[]; onView?: (o: Opportunity) => void; onEdit?: (o: Opportunity) => void; onDelete?: (id: string) => void }

export function OpportunitiesTable({ opportunities, onView, onEdit, onDelete }: Props) {
  if (!opportunities || opportunities.length === 0) return <div style={{ color: 'var(--secondary)' }}>No opportunities found.</div>;

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: 12 }}>Opportunity</th>
            <th style={{ padding: 12 }}>Company</th>
            <th style={{ padding: 12 }}>Stage</th>
            <th style={{ padding: 12 }}>Value</th>
            <th style={{ padding: 12 }}>Owner</th>
            <th style={{ padding: 12 }}>Close Date</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 12, fontWeight: 700 }}>{o.name}</td>
              <td style={{ padding: 12 }}>{o.companyName || '-'}</td>
              <td style={{ padding: 12 }}>{o.stage}</td>
              <td style={{ padding: 12 }}>${o.value.toLocaleString()}</td>
              <td style={{ padding: 12 }}>{o.ownerName || '-'}</td>
              <td style={{ padding: 12 }}>{o.expectedCloseDate ? new Date(o.expectedCloseDate).toLocaleDateString() : '-'}</td>
              <td style={{ padding: 12 }}>{o.status || 'In Progress'}</td>
              <td style={{ padding: 12 }}>
                <button onClick={()=>onView?.(o)} style={{ marginRight: 8 }}><Eye size={14} /></button>
                <button onClick={()=>onEdit?.(o)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                <button onClick={()=>onDelete?.(o.id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
