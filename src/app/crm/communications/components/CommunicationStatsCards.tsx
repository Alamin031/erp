"use client"

import { useMemo } from 'react'
import type { Communication } from '../types/communication'
import { Mail, Phone, Calendar, MessageSquare } from 'lucide-react'

export function CommunicationStatsCards({ items }: { items: Communication[] }) {
  const stats = useMemo(()=>{
    const total = items.length
    const calls = items.filter(i=>i.type==='call').length
    const emails = items.filter(i=>i.type==='email').length
    const meetings = items.filter(i=>i.type==='meeting').length
    const pending = items.filter(i=>i.status !== 'resolved').length
    return { total, calls, emails, meetings, pending }
  }, [items])

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 rounded-2xl shadow-sm" style={{ background: 'var(--card-bg)' }}>
        <div className="flex items-center gap-2"><Mail /> <div className="text-sm text-[var(--secondary)]">Total Communications</div></div>
        <div className="text-2xl font-bold">{stats.total}</div>
      </div>
      <div className="p-4 rounded-2xl shadow-sm" style={{ background: 'var(--card-bg)' }}>
        <div className="flex items-center gap-2"><Phone /> <div className="text-sm text-[var(--secondary)]">Calls Made</div></div>
        <div className="text-2xl font-bold">{stats.calls}</div>
      </div>
      <div className="p-4 rounded-2xl shadow-sm" style={{ background: 'var(--card-bg)' }}>
        <div className="flex items-center gap-2"><MessageSquare /> <div className="text-sm text-[var(--secondary)]">Emails Sent</div></div>
        <div className="text-2xl font-bold">{stats.emails}</div>
      </div>
      <div className="p-4 rounded-2xl shadow-sm" style={{ background: 'var(--card-bg)' }}>
        <div className="flex items-center gap-2"><Calendar /> <div className="text-sm text-[var(--secondary)]">Meetings Scheduled</div></div>
        <div className="text-2xl font-bold">{stats.meetings}</div>
      </div>
    </div>
  )
}
