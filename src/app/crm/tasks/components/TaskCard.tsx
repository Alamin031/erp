"use client"

import type { Task } from '@/app/crm/tasks/types/task'

export function TaskCard({ task, onClick }: { task: Task; onClick?: (id: string) => void }) {
  const accent = (() => {
    switch (task.priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#eab308'
      case 'low': return '#9ca3af'
    }
  })()
  const statusText = task.status.replace('_', ' ')
  const dueLabel = task.dueAt ? new Date(task.dueAt).toLocaleString() : 'No due'

  return (
    <button
      onClick={() => onClick?.(task.id)}
      className="w-full text-left"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      aria-label={`Task ${task.subject}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 24, background: accent, borderRadius: 4 }} />
          <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{task.subject}</div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'capitalize' }}>{statusText}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--secondary)' }}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[var(--border)] flex items-center justify-center text-[10px]">
            {(task.assignee?.name || 'NA').split(' ').map(s=>s[0]).slice(0,2).join('')}
          </div>
          <span>{task.assignee?.name || 'Unassigned'}</span>
        </div>
        <div>{dueLabel}</div>
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {task.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--secondary)', padding: '2px 6px', borderRadius: 999 }}>{tag}</span>
          ))}
        </div>
      )}
    </button>
  )
}
