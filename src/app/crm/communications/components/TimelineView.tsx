"use client"

export function TimelineView({ items }: { items: { id: string; text: string; timestamp: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(it => (
        <div key={it.id} style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--border)', marginTop: 6 }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--foreground)' }}>{it.text}</div>
            <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{new Date(it.timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
