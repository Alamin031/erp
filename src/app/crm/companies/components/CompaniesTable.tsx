import { Company } from '@/types/companies';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface Props { companies: Company[]; onView?: (c: Company) => void; onEdit?: (c: Company) => void; onDelete?: (id: string) => void }

export function CompaniesTable({ companies, onView, onEdit, onDelete }: Props) {
  if (!companies || companies.length === 0) return <div style={{ color: 'var(--secondary)' }}>No companies found.</div>;

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: 12 }}>Company</th>
            <th style={{ padding: 12 }}>Industry</th>
            <th style={{ padding: 12 }}>Country</th>
            <th style={{ padding: 12 }}>Employees</th>
            <th style={{ padding: 12 }}>Contacts</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{c.website || ''}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: 12 }}>{c.industry || '-'}</td>
              <td style={{ padding: 12 }}>{c.country || '-'}</td>
              <td style={{ padding: 12 }}>{c.size || '-'}</td>
              <td style={{ padding: 12 }}>{(c.contacts || []).length}</td>
              <td style={{ padding: 12 }}><span style={{ padding: '4px 8px', borderRadius: 999, background: c.status === 'Active' ? 'rgba(5,150,105,0.12)' : 'rgba(37,99,235,0.12)', color: c.status === 'Active' ? '#059669' : '#2563eb', fontWeight: 600 }}>{c.status || 'Prospect'}</span></td>
              <td style={{ padding: 12 }}>
                <button onClick={() => onView?.(c)} style={{ marginRight: 8 }}><Eye size={14} /></button>
                <button onClick={() => onEdit?.(c)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                <button onClick={() => onDelete?.(c.id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
