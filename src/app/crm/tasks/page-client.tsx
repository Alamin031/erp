"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTasks } from '@/store/useTasks'
import { useToast, ToastContainer } from '@/components/toast'
import { FiltersBar } from './components/FiltersBar'
import { TaskTable } from './components/TaskTable'
import { TaskFormModal } from './components/TaskFormModal'
import { TaskDetailsDrawer } from './components/TaskDetailsDrawer'
import { QuickAddTask } from './components/QuickAddTask'
import { TaskStatsCards } from './components/TaskStatsCards'
import type { Task } from './types/task'

export function TasksPageClient() {
  const { tasks, fetchTasks, getCounts, filters, pagination, activity } = useTasks()
  const { showToast, toasts, removeToast } = useToast()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [tab, setTab] = useState<'all' | 'mine' | 'today' | 'overdue' | 'followups'>(filters.tab || 'all')

  useEffect(() => { fetchTasks({ tab }, pagination) }, [tab])

  const counts = getCounts()

  const visibleTasks = useMemo(() => {
    const now = new Date()
    if (tab === 'today') return tasks.filter(t => t.dueAt && new Date(t.dueAt).toDateString() === now.toDateString())
    if (tab === 'overdue') return tasks.filter(t => t.dueAt && new Date(t.dueAt) < now && t.status !== 'done' && t.status !== 'cancelled')
    if (tab === 'followups') return tasks.filter(t => (t.followUps || []).some(f => !f.completed))
    if (tab === 'mine') return tasks.filter(t => t.assignee?.name === 'You')
    return tasks
  }, [tasks, tab])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Tasks</h1>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>Tasks management is under development. Create and manage CRM tasks and follow-up items.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary" onClick={()=>setIsCreateOpen(true)}>Quick Add</button>
          <button className="btn btn-primary" onClick={()=>setIsCreateOpen(true)}>Create Task</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[{label:'Total Tasks', value: counts.total},{label:'Due Today', value: counts.dueToday},{label:'Overdue', value: counts.overdue},{label:'Follow-ups due', value: counts.followupsDue}].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div className="text-sm" style={{ color: 'var(--secondary)' }}>{c.label}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {(['all','mine','today','overdue','followups'] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`text-sm px-3 py-1 rounded-full border ${tab===t ? 'bg-[var(--foreground)] text-[var(--background)] border-transparent' : 'border-[var(--border)] text-[var(--secondary)]'}`}>{t === 'mine' ? 'My Tasks' : t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <FiltersBar />
      </div>

      {/* Task Table - Full Width */}
      <div className="mb-4">
        <TaskTable items={visibleTasks} onView={(id)=>setViewId(id)} onEdit={(id)=>{ const t = tasks.find(x=>x.id===id) || null; setEditTask(t); setIsCreateOpen(true) }} />
      </div>

      {/* Bottom Section - Quick Add, Stats, and Activity in a Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Add</h3>
          <QuickAddTask />
        </div>
        
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <TaskStatsCards items={tasks} />
        </div>
        
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Activity</h3>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
            {activity.length === 0 && <div className="text-sm" style={{ color: 'var(--secondary)' }}>No activity yet</div>}
            {activity.map(a => (
              <div key={a.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                <div className="text-sm" style={{ color: 'var(--foreground)' }}>{a.text}</div>
                <div className="text-xs" style={{ color: 'var(--secondary)' }}>{new Date(a.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskFormModal isOpen={isCreateOpen} onClose={()=>{ setIsCreateOpen(false); setEditTask(null) }} task={editTask || undefined} />
      <TaskDetailsDrawer id={viewId} isOpen={!!viewId} onClose={()=>setViewId(null)} onEdit={(id)=>{ const t = tasks.find(x=>x.id===id) || null; setEditTask(t); setIsCreateOpen(true) }} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
