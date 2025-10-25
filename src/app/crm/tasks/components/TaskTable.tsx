"use client"

import { useMemo, useState } from 'react'
import type { Task } from '@/app/crm/tasks/types/task'
import { useTasks } from '@/store/useTasks'
import { useUsers } from '@/store/useUsers'
import { ChevronDown } from 'lucide-react'

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

  const badgeForPriority = (p: Task['priority']) => {
    switch (p) {
      case 'urgent': return 'bg-red-600 text-white'
      case 'high': return 'bg-orange-500 text-black'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-gray-600 text-white'
    }
  }

  const badgeForStatus = (s: Task['status']) => {
    switch (s) {
      case 'open': return 'bg-blue-600 text-white'
      case 'in_progress': return 'bg-indigo-600 text-white'
      case 'waiting': return 'bg-amber-600 text-white'
      case 'done': return 'bg-green-600 text-white'
      case 'cancelled': return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container" style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <table className="reservations-table w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
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
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer"
                  style={{ color: 'var(--secondary)' }}
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
                  <div className="flex items-center gap-2">
                    {col.label} {sort.field === col.key && <ChevronDown size={16} />}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`} style={{ borderBottom: '1px solid var(--border)' }}>
                <td colSpan={9} className="px-4 py-4">
                  <div className="animate-pulse h-4 w-full bg-[var(--border)] rounded" />
                </td>
              </tr>
            ))}
            {!isLoading && sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center" style={{ color: 'var(--secondary)' }}>
                  No tasks found
                </td>
              </tr>
            )}
            {!isLoading && sorted.map((t) => {
              const nextFu = (t.followUps || []).filter(f => !f.completed && f.dueAt).sort((a,b)=> new Date(a.dueAt as string).getTime() - new Date(b.dueAt as string).getTime())[0]
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{t.id}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{t.subject}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--secondary)' }}>
                    {t.contact ? (
                      <div>
                        <div className="font-medium" style={{ color: 'var(--foreground)' }}>{t.contact.name}</div>
                        <div className="text-xs" style={{ color: 'var(--secondary)' }}>{t.contact.company || ''}</div>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--secondary)' }}>
                    {t.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[var(--border)] flex items-center justify-center text-[10px]">{t.assignee.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                        <span>{t.assignee.name}</span>
                      </div>
                    ) : 'Unassigned'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--secondary)' }}>{t.dueAt ? new Date(t.dueAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center justify-center h-6 min-w-[72px] px-3 rounded-full text-xs font-medium ${badgeForPriority(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center justify-center h-6 min-w-[88px] px-3 rounded-full text-xs font-medium ${badgeForStatus(t.status)}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--secondary)' }}>{nextFu?.dueAt ? new Date(nextFu.dueAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-sm flex gap-2 items-center">
                    <button
                      onClick={() => onView(t.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
                      title="View details"
                    >View</button>
                    <button
                      onClick={() => onEdit(t.id)}
                      className="text-green-600 hover:text-green-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-200"
                      title="Edit task"
                    >Edit</button>
                    <button
                      onClick={() => markTaskDone(t.id)}
                      className="text-emerald-600 hover:text-emerald-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      title="Mark complete"
                    >Complete</button>
                    <div className="relative">
                      <button
                        onClick={() => setReassignRow(reassignRow === t.id ? null : t.id)}
                        className="text-purple-600 hover:text-purple-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-200"
                        title="Reassign"
                      >Reassign</button>
                      {reassignRow === t.id && (
                        <div className="absolute z-10 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded p-2 shadow-lg">
                          <select
                            className="form-input"
                            defaultValue={t.assignee?.id || ''}
                            onChange={(e) => {
                              const id = e.target.value
                              if (id) assignTask(t.id, id)
                              setReassignRow(null)
                            }}
                          >
                            <option value="">Select user</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
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
