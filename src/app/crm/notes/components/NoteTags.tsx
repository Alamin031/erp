"use client";

import { Tag } from '@/types/notes';

interface Props { tagIds?: string[]; tags?: Tag[] }

export function NoteTags({ tagIds = [], tags = [] }: Props) {
  const resolved = (tagIds || []).map(id => tags.find(t=>t.id===id)).filter(Boolean) as Tag[];

  if(resolved.length === 0) return <div style={{ color: 'var(--muted)' }}>—</div>;

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {resolved.map(t => (
        <span key={t.id} style={{ padding: '4px 8px', borderRadius: 8, background: t.color || 'var(--border)', color: '#000', fontSize: 12 }}>{t.name}</span>
      ))}
    </div>
  );
}
