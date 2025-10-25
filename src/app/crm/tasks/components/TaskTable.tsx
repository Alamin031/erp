"use client"

import { useMemo, useState } from 'react'
import type { Task } from '@/app/crm/tasks/types/task'
import { useTasks } from '@/store/useTasks'
import { useUsers } from '@/store/useUsers'
import { ChevronDown, Eye, Edit2, CheckCircle2, UserPlus, Calendar, AlertCircle } from 'lucide-react'

interface Props {
  items: Task[]
  onView: (id: string) => void
  onEdit: (id: string) => void
}

type SortField = 'id' | 'subject' | 'contact' | 'assignee' | 'dueAt' | 'priority' | 'status' | 'nextFollowUp'
interface SortState { field: SortField; direction: 'asc' | 'desc' }

export function TaskTable({ items, onView, onEdit }: Props) {
  const { markTaskDone, assignTask, isLoading } = useTasks()
  const users = useUsers((s) => s.users)
  const [sort, setSort] = useState<SortState>({ field: 'dueAt', direction: 'asc' })
  const [reassignRow, setReassignRow] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const copy = [...items]
    copy.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      switch (sort.field) {
        case 'id': return a.id.localeCompare(b.id) * dir
        case 'subject': return (a.subject || '').localeCompare(b.subject || '') * dir
        case 'contact': return (a.contact?.name || '').localeCompare(b.contact?.name || '') * dir
        case 'assignee': return (a.assignee?.name || '').localeCompare(b.assignee?.name || '') * dir
        case 'priority': return a.priority.localeCompare(b.priority) * dir
        case 'status': return a.status.localeCompare(b.status) * dir
        case 'nextFollowUp': {
          const an = (a.followUps || []).filter(f => !f.completed && f.dueAt).sort((x,y)=> new Date(x.dueAt as string).getTime() - new Date(y.dueAt as string).getTime())[0]
          const bn = (b.followUps || []).filter(f => !f.completed && f.dueAt).sort((x,y)=> new Date(x.dueAt as string).getTime() - new Date(y.dueAt as string).getTime())[0]
          const at = an?.dueAt ? new Date(an.dueAt).getTime() : Number.MAX_SAFE_INTEGER
          const bt = bn?.dueAt ? new Date(bn.dueAt).getTime() : Number.MAX_SAFE_INTEGER
          return (at - bt) * (sort.direction === 'asc' ? 1 : -1)
        }
        case 'dueAt':
        default: {
          const at = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER
          const bt = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER
          return (at - bt) * (sort.direction === 'asc' ? 1 : -1)
        }
      }
    })
    return copy
  }, [items, sort])

  const ariaSort = (field: SortField) => sort.field === field ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'

  const getPriorityStyle = (p: Task['priority']) => {
    switch (p) {
      case 'urgent': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }
      case 'high': return { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', color: '#f97316' }
      case 'medium': return { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }
      case 'low': return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', color: '#9ca3af' }
    }
  }

  const getStatusStyle = (s: Task['status']) => {
    switch (s) {
      case 'open': return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' }
      case 'in_progress': return { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', color: '#6366f1' }
      case 'waiting': return { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }
      case 'done': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' }
      case 'cancelled': return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', color: '#6b7280' }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container" style={{ 
        border: '1px solid var(--border)', 
        borderRadius: 16, 
        overflow: 'hidden',
        background: 'var(--card-bg)'
      }}>
        <table className="reservations-table w-full">
          <thead>
            <tr style={{ 
              borderBottom: '1px solid var(--border)', 
              background: 'var(--background)' 
            }}>
              {[
                { key: 'id', label: 'ID' },
                { key: 'subject', label: 'Subject' },
                { key: 'contact', label: 'Contact' },
                { key: 'assignee', label: 'Assignee' },
                { key: 'dueAt', label: 'Due Date' },
                { key: 'priority', label: 'Priority' },
                { key: 'status', label: 'Status' },
                { key: 'nextFollowUp', label: 'Next Follow-up' },
              ].map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  role="button"
                  tabIndex={0}
                  aria-sort={ariaSort(col.key as SortField)}
                  className="cursor-pointer transition-colors"
                  style={{ 
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() =>
                    setSort((prev) => ({
                      field: col.key as SortField,
                      direction: prev.field === (col.key as SortField) && prev.direction === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSort((prev) => ({
                        field: col.key as SortField,
                        direction: prev.field === (col.key as SortField) && prev.direction === 'asc' ? 'desc' : 'asc',
                      }))
                    }
                  }}
                >
                  {col.label}
                  <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--secondary)' }}>
                    {sort.field === col.key as SortField ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                  </span>
                </th>
              ))}
              <th style={{ 
                padding: '16px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: '120px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`} style={{ borderBottom: '1px solid var(--border)' }}>
                <td colSpan={9} style={{ padding: '20px' }}>
                  <div style={{ 
                    height: '16px', 
                    background: 'var(--border)', 
                    borderRadius: '8px',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                </td>
              </tr>
            ))}
            {!isLoading && sorted.length === 0 && (
              <tr>
                <td colSpan={9} style={{ 
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--secondary)',
                  fontSize: '14px'
                }}>
                  No tasks found
                </td>
              </tr>
            )}
            {!isLoading && sorted.map((t) => {
              const nextFu = (t.followUps || []).filter(f => !f.completed && f.dueAt).sort((a,b)=> new Date(a.dueAt as string).getTime() - new Date(b.dueAt as string).getTime())[0]
              const priorityStyle = getPriorityStyle(t.priority)
              const statusStyle = getStatusStyle(t.status)
              const isOverdue = t.dueAt && new Date(t.dueAt) < new Date() && t.status !== 'done'
              
              return (
                <tr key={t.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  className="hover:bg-[var(--sidebar-hover)]"
                >
                  <td style={{ 
                    padding: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--foreground)'
                  }}>
                    {t.id}
                  </td>
                  <td style={{ 
                    padding: '16px',
                    fontSize: '13px',
                    color: 'var(--foreground)',
                    fontWeight: '500'
                  }}>
                    {t.subject}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {t.contact ? (
                      <div>
                        <div style={{ 
                          fontSize: '13px',
                          fontWeight: '500',
                          color: 'var(--foreground)'
                        }}>
                          {t.contact.name}
                        </div>
                        {t.contact.company && (
                          <div style={{ 
                            fontSize: '11px',
                            color: 'var(--secondary)',
                            marginTop: '2px'
                          }}>
                            {t.contact.company}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--secondary)', fontSize: '13px' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {t.assignee ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          height: '32px',
                          width: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'white'
                        }}>
                          {t.assignee.name.split(' ').map(s=>s[0]).slice(0,2).join('')}
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                          {t.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {t.dueAt ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: isOverdue ? '#ef4444' : 'var(--secondary)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ 
                            fontSize: '13px',
                            fontWeight: '500',
                            color: isOverdue ? '#ef4444' : 'var(--foreground)'
                          }}>
                            {new Date(t.dueAt).toLocaleDateString()}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                            {new Date(t.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {isOverdue && (
                          <AlertCircle size={14} style={{ color: '#ef4444' }} />
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: priorityStyle.bg,
                      border: `1px solid ${priorityStyle.border}`,
                      color: priorityStyle.color,
                      textTransform: 'capitalize'
                    }}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      color: statusStyle.color,
                      textTransform: 'capitalize'
                    }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--secondary)' }}>
                    {nextFu?.dueAt ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--foreground)' }}>
                          {new Date(nextFu.dueAt).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '11px' }}>
                          {new Date(nextFu.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        onClick={() => onView(t.id)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(t.id)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          background: 'rgba(34, 197, 94, 0.1)',
                          color: '#22c55e',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => markTaskDone(t.id)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Mark complete"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setReassignRow(reassignRow === t.id ? null : t.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            background: 'rgba(168, 85, 247, 0.1)',
                            color: '#a855f7',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Reassign"
                        >
                          <UserPlus size={16} />
                        </button>
                        {reassignRow === t.id && (
                          <div style={{ 
                            position: 'absolute',
                            zIndex: 10,
                            marginTop: '8px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            minWidth: '200px'
                          }}>
                            <select
                              className="form-input"
                              defaultValue={t.assignee?.id || ''}
                              onChange={(e) => {
                                const id = e.target.value
                                if (id) assignTask(t.id, id)
                                setReassignRow(null)
                              }}
                              style={{ width: '100%' }}
                            >
                              <option value="">Select user</option>
                              {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        
      </div>
    </div>
  )
}
