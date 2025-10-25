"use client"

import { useState } from 'react'
import type { FollowUp } from '@/app/crm/tasks/types/task'
import { useTasks } from '@/store/useTasks'
import { useToast } from '@/components/toast'

export function FollowUpList({ taskId, items }: { taskId: string; items: FollowUp[] }) {
  const { completeFollowUp, addFollowUp } = useTasks()
  const { showToast } = useToast()
  const [addOpen, setAddOpen] = useState(false)
  const [note, setNote] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [reminder, setReminder] = useState(false)
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none')

  const handleAdd = async () => {
    if (!note.trim()) return
    await addFollowUp(taskId, { note: note.trim(), dueAt: dueAt || null, createdBy: { id: 'system', name: 'System' }, reminder })
    setNote(''); setDueAt(''); setReminder(false); setRecurrence('none'); setAddOpen(false)
    showToast('Follow-up added', 'success')
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && <div className="text-sm" style={{ color: 'var(--secondary)' }}>No follow-ups</div>}
      {items.map(f => (
        <div key={f.id} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div className="text-sm" style={{ color: 'var(--foreground)' }}>{f.note}</div>
            <div className="text-xs" style={{ color: 'var(--secondary)' }}>{f.dueAt ? new Date(f.dueAt).toLocaleString() : 'No due'}</div>
          </div>
          <div className="flex items-center gap-2">
            {!f.completed ? (
              <button className="btn btn-secondary" onClick={() => completeFollowUp(taskId, f.id)}>Complete</button>
            ) : (
              <span className="text-xs" style={{ color: 'var(--secondary)' }}>Done {f.completedAt ? new Date(f.completedAt).toLocaleString() : ''}</span>
            )}
            <button className="btn btn-secondary" onClick={() => setDueAt(new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,16))}>+1d</button>
          </div>
        </div>
      ))}

      <div>
        {!addOpen ? (
          <button className="btn btn-secondary" onClick={() => setAddOpen(true)}>Add follow-up</button>
        ) : (
          <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input className="form-input" placeholder="Reminder note" value={note} onChange={(e)=>setNote(e.target.value)} />
            <div className="flex items-center gap-2">
              <input type="datetime-local" className="form-input" value={dueAt} onChange={(e)=>setDueAt(e.target.value)} />
              <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--secondary)' }}>
                <input type="checkbox" checked={reminder} onChange={(e)=>setReminder(e.target.checked)} /> Reminder
              </label>
              <select className="form-input" value={recurrence} onChange={(e)=>setRecurrence(e.target.value as any)}>
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" onClick={handleAdd}>Add</button>
              <button className="btn btn-secondary" onClick={()=>setAddOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
