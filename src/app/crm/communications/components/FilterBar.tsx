"use client"

import { useState, useEffect } from 'react'
import type { CommFilters } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'
import { Mail, Phone, Calendar, MessageSquare, CheckCircle2, Clock, RotateCw } from 'lucide-react'

export function FilterBar({ children }: { children?: React.ReactNode }) {
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

  const typeConfig = {
    email: { Icon: Mail, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)' },
    call: { Icon: Phone, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' },
    meeting: { Icon: Calendar, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)' },
    chat: { Icon: MessageSquare, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' }
  }

  const statusConfig = {
    resolved: { Icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' },
    follow_up: { Icon: RotateCw, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)' },
    pending: { Icon: Clock, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' }
  }

  return (
    <div 
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}
    >
      {/* Header with Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: 'var(--foreground)'
        }}>
          Filter Communications
        </div>
        {/* Search box will be passed as children */}
        <div style={{ flex: '0 0 auto', minWidth: '300px' }}>
          {children}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: 'var(--secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          Communication Type
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map(t=> {
            const config = typeConfig[t]
            const isActive = types.includes(t)
            const Icon = config.Icon
            return (
              <button 
                key={t} 
                onClick={()=>setTypes(prev=>toggle(prev, t))}
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isActive ? config.color : 'var(--border)'}`,
                  background: isActive ? config.bg : 'transparent',
                  color: isActive ? config.color : 'var(--secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'capitalize'
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: 'var(--secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          Status
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(s=> {
            const config = statusConfig[s]
            const isActive = status.includes(s)
            const Icon = config.Icon
            return (
              <button 
                key={s} 
                onClick={()=>setStatus(prev=>toggle(prev, s))}
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isActive ? config.color : 'var(--border)'}`,
                  background: isActive ? config.bg : 'transparent',
                  color: isActive ? config.color : 'var(--secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'capitalize'
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {s.replace('_',' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Date Range & Agent */}
      <div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: 'var(--secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          Date Range & Agent
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input 
            type="date" 
            className="form-input" 
            value={dateFrom} 
            onChange={(e)=>setDateFrom(e.target.value)}
            style={{ minWidth: '180px' }}
          />
          <span style={{ 
            color: 'var(--secondary)', 
            fontWeight: '500',
            fontSize: '13px'
          }}>
            to
          </span>
          <input 
            type="date" 
            className="form-input" 
            value={dateTo} 
            onChange={(e)=>setDateTo(e.target.value)}
            style={{ minWidth: '180px' }}
          />
          <input 
            className="form-input" 
            placeholder="Agent ID" 
            value={agent} 
            onChange={(e)=>setAgent(e.target.value)}
            style={{ minWidth: '150px' }}
          />
          <button 
            className="btn btn-secondary" 
            onClick={reset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}
