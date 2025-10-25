"use client"

import { useMemo, useState } from 'react'
import { useTasks } from '@/store/useTasks'
import type { Task, TaskStatus } from '@/app/crm/tasks/types/task'
import { FollowUpList } from './FollowUpList'

export function TaskDetailsDrawer({ id, isOpen, onClose, onEdit }: { id: string | null; isOpen: boolean; onClose: ()=>void; onEdit: (id: string)=>void }) {
  const { tasks, markTaskDone, updateTask } = useTasks()
  const task = useMemo<Task | null>(() => tasks.find(t=>t.id===id) || null, [tasks, id])
  const [note, setNote] = useState('')

  if (!isOpen || !task) return null

  const statusStyle = (s: TaskStatus) => {
    switch (s) {
      case 'open': return { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' }
      case 'in_progress': return { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', color: '#6366f1' }
      case 'waiting': return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' }
      case 'done': return { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' }
      case 'cancelled': return { bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.3)', color: '#9ca3af' }
    }
  }

  const addNote = async () => {
    if (!note.trim()) return
    await updateTask(task.id, { notes: [...(task.notes || []), { id: `N-${Date.now()}`, author: 'You', text: note.trim(), createdAt: new Date().toISOString() }] })
    setNote('')
  }

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <div>
            <h2 className="slide-over-title">{task.subject}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: statusStyle(task.status).bg, border: `1px solid ${statusStyle(task.status).border}`, color: statusStyle(task.status).color }}>{task.status.replace('_',' ')}</span>
              {task.dueAt && <span style={{ fontSize: 12, color: 'var(--secondary)' }}>Due {new Date(task.dueAt).toLocaleString()}</span>}
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose}>✕</button>
        </div>
        <div className="slide-over-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 13 }}>
                <div>
                  <div style={{ color: 'var(--secondary)', fontSize: 11, marginBottom: 2 }}>Assignee</div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 500 }}>{task.assignee?.name || 'Unassigned'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--secondary)', fontSize: 11, marginBottom: 2 }}>Contact</div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 500 }}>{task.contact ? `${task.contact.name} — ${task.contact.company || ''}` : '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--secondary)', fontSize: 11, marginBottom: 2 }}>Priority</div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 500, textTransform: 'capitalize' }}>{task.priority}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--secondary)', fontSize: 11, marginBottom: 2 }}>Created</div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 500 }}>{new Date(task.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {task.description && <p style={{ marginTop: 12, color: 'var(--secondary)', fontSize: 13 }}>{task.description}</p>}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Follow-ups</h3>
              <FollowUpList taskId={task.id} items={task.followUps || []} />
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</h3>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                  {(task.notes || []).length === 0 && <div className="text-sm" style={{ color: 'var(--secondary)' }}>No notes</div>}
                  {(task.notes || []).map(n => (
                    <div key={n.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--foreground)' }}>{n.author}</div>
                        <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--foreground)' }}>{n.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input className="form-input" placeholder="Add internal note" value={note} onChange={(e)=>setNote(e.target.value)} />
                  <button className="btn btn-secondary" onClick={addNote}>Add Note</button>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-secondary" onClick={() => onEdit(task.id)}>Edit</button>
                <button className="btn btn-secondary" onClick={() => updateTask(task.id, { status: 'in_progress' })}>Set In Progress</button>
                <button className="btn btn-secondary" onClick={() => updateTask(task.id, { status: 'waiting' })}>Set Waiting</button>
                <button className="btn btn-primary" onClick={() => { markTaskDone(task.id); onClose() }}>Mark Done</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
