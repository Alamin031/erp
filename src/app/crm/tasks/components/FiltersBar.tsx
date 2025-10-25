"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTasks } from '@/store/useTasks'
import type { TaskPriority, TaskStatus } from '@/app/crm/tasks/types/task'

export function FiltersBar() {
  const { fetchTasks, filters, pagination } = useTasks()
  const [q, setQ] = useState(filters.q || '')
  const [status, setStatus] = useState<TaskStatus[]>(filters.status || [])
  const [priority, setPriority] = useState<TaskPriority[]>(filters.priority || [])
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || '')
  const [dateTo, setDateTo] = useState(filters.dateTo || '')

  useEffect(() => {
    const t = setTimeout(() => {
      fetchTasks({ ...filters, q }, pagination)
    }, 400)
    return () => clearTimeout(t)
  }, [q])

  const toggle = <T extends string>(list: T[], value: T): T[] => list.includes(value) ? list.filter(v=>v!==value) : [...list, value]

  const apply = () => fetchTasks({ ...filters, q, status, priority, dateFrom, dateTo }, { page: 1, pageSize: pagination.pageSize })
  const clear = () => {
    setQ(''); setStatus([]); setPriority([]); setDateFrom(''); setDateTo('')
    fetchTasks({ tab: filters.tab }, { page: 1, pageSize: pagination.pageSize })
  }

  const chips = useMemo(() => ([
    ...status.map(s=>({ label: s.replace('_',' '), type: 'status' as const, value: s })),
    ...priority.map(p=>({ label: p, type: 'priority' as const, value: p })),
  ]), [status, priority])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input className="form-input" style={{ minWidth: 240 }} placeholder="Search tasks" value={q} onChange={(e)=>setQ(e.target.value)} />
        <div className="flex items-center gap-1 flex-wrap">
          {(['open','in_progress','waiting','done','cancelled'] as TaskStatus[]).map(s => (
            <button key={s} onClick={()=>setStatus(prev=>toggle(prev, s))} className={`text-xs px-3 py-1 rounded-full border ${status.includes(s) ? 'bg-blue-600 text-white border-transparent' : 'border-[var(--border)] text-[var(--secondary)]'}`}>{s.replace('_',' ')}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(['low','medium','high','urgent'] as TaskPriority[]).map(p => (
            <button key={p} onClick={()=>setPriority(prev=>toggle(prev, p))} className={`text-xs px-3 py-1 rounded-full border ${priority.includes(p) ? 'bg-amber-600 text-white border-transparent' : 'border-[var(--border)] text-[var(--secondary)]'}`}>{p}</button>
          ))}
        </div>
        <input type="date" className="form-input" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
        <span style={{ color: 'var(--secondary)', fontSize: 12 }}>to</span>
        <input type="date" className="form-input" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
        <div className="flex items-center gap-2 ml-auto">
          <button className="btn btn-secondary" onClick={clear}>Clear</button>
          <button className="btn btn-primary" onClick={apply}>Apply</button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {chips.map(c => (
          <span key={`${c.type}-${c.value}`} className="text-xs" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--secondary)', padding: '2px 6px', borderRadius: 999 }}>{c.label}</span>
        ))}
      </div>
    </div>
  )
}
