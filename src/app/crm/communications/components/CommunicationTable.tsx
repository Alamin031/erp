"use client"

import { useState } from 'react'
import type { Communication } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'
import { Mail, Phone, Calendar, MessageSquare, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export function CommunicationTable({ items, onView, onEdit }: { items: Communication[]; onView: (id:string)=>void; onEdit: (id:string)=>void }) {
  const { deleteCommunication, isLoading } = useCommunications()
  const [page, setPage] = useState(1)

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'email': return <Mail size={16} style={{ color: '#a855f7' }} />;
      case 'call': return <Phone size={16} style={{ color: '#22c55e' }} />;
      case 'meeting': return <Calendar size={16} style={{ color: '#fbbf24' }} />;
      case 'chat': return <MessageSquare size={16} style={{ color: '#3b82f6' }} />;
      default: return <Mail size={16} style={{ color: '#9ca3af' }} />;
    }
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'resolved':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' };
      case 'follow_up':
        return { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' };
      case 'pending':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', color: '#9ca3af' };
    }
  }

  return (
    <div style={{ 
      border: '1px solid var(--border)', 
      borderRadius: '16px', 
      overflow: 'hidden',
      background: 'var(--card-bg)'
    }}>
      <table className="w-full">
        <thead style={{ 
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)'
        }}>
          <tr>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Date & Time</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Type</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Customer</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Subject</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Status</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Agent</th>
            <th style={{ 
              padding: '16px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && Array.from({ length: 4 }).map((_,i)=> (
            <tr key={i}>
              <td colSpan={7} style={{ padding: '20px' }}>
                <div style={{ 
                  height: '16px', 
                  background: 'var(--border)', 
                  borderRadius: '8px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
              </td>
            </tr>
          ))}
          {!isLoading && items.length === 0 && (
            <tr>
              <td colSpan={7} style={{ 
                padding: '48px',
                textAlign: 'center',
                color: 'var(--secondary)',
                fontSize: '14px'
              }}>
                No communications found
              </td>
            </tr>
          )}
          {!isLoading && items.map(it => {
            const statusStyle = getStatusStyle(it.status);
            return (
              <tr 
                key={it.id} 
                style={{
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-[var(--sidebar-hover)]"
                onClick={(e)=>{ if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') onView(it.id) }}
              >
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--foreground)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: '500' }}>
                      {new Date(it.dateTime).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                      {new Date(it.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {getTypeIcon(it.type)}
                    <span style={{ color: 'var(--foreground)' }}>{it.type}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', fontWeight: '500', color: 'var(--foreground)' }}>
                  {it.customer.name}
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--foreground)' }}>
                  <div style={{ 
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {it.subject || it.summary || '—'}
                  </div>
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
                    {it.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--secondary)' }}>
                  {it.agent?.name || '—'}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={(e)=>{ e.stopPropagation(); onView(it.id) }}
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
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e)=>{ e.stopPropagation(); onEdit(it.id) }}
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
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={async (e)=>{ e.stopPropagation(); if(confirm('Delete this communication?')) await deleteCommunication(it.id) }}
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ 
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border)',
        background: 'var(--background)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--secondary)' }}>
          Showing <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>{items.length}</span> communications
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary"
            onClick={()=>setPage(p=>Math.max(1,p-1))}
            disabled={page === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: page === 1 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <div style={{ 
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--foreground)'
          }}>
            Page {page}
          </div>
          <button 
            className="btn btn-secondary"
            onClick={()=>setPage(p=>p+1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
