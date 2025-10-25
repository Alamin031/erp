"use client"

import { useMemo } from 'react'
import type { Task } from '@/app/crm/tasks/types/task'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export function TaskStatsCards({ items }: { items: Task[] }) {
  const counts = useMemo(() => {
    const now = new Date()
    const open = items.filter(t => t.status === 'open').length
    const inProgress = items.filter(t => t.status === 'in_progress').length
    const done7 = items.filter(t => t.status === 'done' && t.updatedAt && (now.getTime() - new Date(t.updatedAt).getTime()) <= 7*24*60*60*1000).length
    const overdue = items.filter(t => t.dueAt && new Date(t.dueAt) < now && t.status !== 'done' && t.status !== 'cancelled').length
    const byStatus = [
      { name: 'Open', value: open },
      { name: 'In Progress', value: inProgress },
      { name: 'Waiting', value: items.filter(t => t.status === 'waiting').length },
      { name: 'Done', value: items.filter(t => t.status === 'done').length },
    ]
    const byPriority = [
      { name: 'Low', value: items.filter(t => t.priority === 'low').length },
      { name: 'Medium', value: items.filter(t => t.priority === 'medium').length },
      { name: 'High', value: items.filter(t => t.priority === 'high').length },
      { name: 'Urgent', value: items.filter(t => t.priority === 'urgent').length },
    ]
    return { open, inProgress, overdue, done7, byStatus, byPriority }
  }, [items])

  const COLORS = ['#3b82f6','#6366f1','#f59e0b','#22c55e']

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Open', value: counts.open }, { label: 'In Progress', value: counts.inProgress }, { label: 'Overdue', value: counts.overdue }, { label: 'Completed (7d)', value: counts.done7 }].map((c) => (
          <div key={c.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{c.label}</div>
            <div style={{ fontSize: 22, color: 'var(--foreground)', fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, height: 180 }}>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 8 }}>Tasks by Status</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={counts.byStatus} dataKey="value" nameKey="name" outerRadius={60} innerRadius={30}>
                {counts.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, height: 180 }}>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 8 }}>Tasks by Priority</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counts.byPriority}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
