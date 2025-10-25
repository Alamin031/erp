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

  const statCards = [
    { 
      icon: Mail, 
      label: 'Total Communications', 
      value: stats.total,
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      iconColor: '#3b82f6'
    },
    { 
      icon: Phone, 
      label: 'Calls Made', 
      value: stats.calls,
      bgColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      iconColor: '#22c55e'
    },
    { 
      icon: MessageSquare, 
      label: 'Emails Sent', 
      value: stats.emails,
      bgColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      iconColor: '#a855f7'
    },
    { 
      icon: Calendar, 
      label: 'Meetings Scheduled', 
      value: stats.meetings,
      bgColor: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      iconColor: '#fbbf24'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div 
            key={idx}
            className="rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]" 
            style={{ 
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              padding: '20px'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div 
                  style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px'
                  }}
                >
                  {card.label}
                </div>
                <div 
                  style={{ 
                    fontSize: '32px',
                    fontWeight: '700',
                    color: 'var(--foreground)',
                    lineHeight: '1'
                  }}
                >
                  {card.value}
                </div>
              </div>
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: card.bgColor,
                  border: `1px solid ${card.borderColor}`,
                  flexShrink: 0
                }}
              >
                <Icon size={24} style={{ color: card.iconColor }} strokeWidth={2} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
