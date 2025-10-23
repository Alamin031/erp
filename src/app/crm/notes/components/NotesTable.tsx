"use client";

import { Note } from '@/types/notes';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NoteTags } from './NoteTags';

interface Props { notes: Note[]; tags?: any[]; onView?: (n: Note)=>void; onEdit?: (n: Note)=>void; onDelete?: (id: string)=>void }

export function NotesTable({ notes, tags = [], onView, onEdit, onDelete }: Props) {
  const [selected, setSelected] = useState<Record<string,boolean>>({});

  const toggle = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const deleteSelected = () => { Object.keys(selected).filter(k=>selected[k]).forEach(id=>onDelete?.(id)); setSelected({}); };

  if (!notes || notes.length === 0) return <div style={{ color: 'var(--secondary)' }}>No notes.</div>;

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <button className="btn btn-ghost" onClick={()=>{ /* placeholder for export */ }}>Export</button>
        </div>
        <div>
          <button className="btn btn-danger" onClick={deleteSelected}>Delete Selected</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: 8 }}></th>
              <th style={{ padding: 8 }}>Note ID</th>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Linked Entity</th>
              <th style={{ padding: 8 }}>Tags</th>
              <th style={{ padding: 8 }}>Owner</th>
              <th style={{ padding: 8 }}>Created At</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 8 }}><input type="checkbox" checked={!!selected[n.id]} onChange={()=>toggle(n.id)} /></td>
                <td style={{ padding: 8 }}>{n.id}</td>
                <td style={{ padding: 8 }}>{n.title}</td>
                <td style={{ padding: 8 }}>{n.linkedEntityType}{n.linkedEntityName ? ` — ${n.linkedEntityName}` : ''}</td>
                <td style={{ padding: 8 }}><NoteTags tagIds={n.tags} tags={tags} /></td>
                <td style={{ padding: 8 }}>{n.ownerName || n.ownerId || '-'}</td>
                <td style={{ padding: 8 }}>{new Date(n.createdAt).toLocaleString()}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={()=>onView?.(n)} style={{ marginRight: 8 }}><Eye size={14} /></button>
                  <button onClick={()=>onEdit?.(n)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                  <button onClick={()=>onDelete?.(n.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
