"use client"

import { useState, useEffect } from 'react'
import type { CommFilters } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'

export function FilterBar() {
  const { setFilter, fetchCommunications, pagination } = useCommunications()
  const [types, setTypes] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [agent, setAgent] = useState('')

  useEffect(()=>{
    const t = setTimeout(()=> fetchCommunications({ types: types as any, status: status as any, agentIds: agent? [agent] : undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }, { page: 1, pageSize: pagination.pageSize }), 300)
    return ()=> clearTimeout(t)
  }, [types, status, dateFrom, dateTo, agent])

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]
  const reset = () => { setTypes([]); setStatus([]); setDateFrom(''); setDateTo(''); setAgent(''); fetchCommunications({}, { page: 1, pageSize: pagination.pageSize }) }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        {(['email','call','meeting','chat'] as const).map(t=> (
          <button key={t} onClick={()=>setTypes(prev=>toggle(prev, t))} className={`text-xs px-3 py-1 rounded-full border ${types.includes(t) ? 'bg-blue-600 text-white' : 'border-[var(--border)] text-[var(--secondary)]'}`}>{t}</button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {(['resolved','follow_up','pending'] as const).map(s=> (
          <button key={s} onClick={()=>setStatus(prev=>toggle(prev, s))} className={`text-xs px-3 py-1 rounded-full border ${status.includes(s) ? 'bg-amber-600 text-white' : 'border-[var(--border)] text-[var(--secondary)]'}`}>{s.replace('_',' ')}</button>
        ))}
      </div>
      <input type="date" className="form-input" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
      <span className="text-[var(--secondary)]">to</span>
      <input type="date" className="form-input" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
      <input className="form-input" placeholder="Agent id" value={agent} onChange={(e)=>setAgent(e.target.value)} />
      <button className="btn btn-secondary" onClick={reset}>Reset Filters</button>
    </div>
  )
}
