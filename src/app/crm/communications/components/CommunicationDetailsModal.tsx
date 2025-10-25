"use client"

import { useState } from 'react'
import type { Communication } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'
import { TimelineView } from './TimelineView'

export function CommunicationDetailsModal({ id, isOpen, onClose }: { id: string | null; isOpen: boolean; onClose: ()=>void }) {
  const { getById, updateCommunication } = useCommunications()
  const comm = id ? getById(id) : null
  const [note, setNote] = useState('')

  if (!isOpen || !comm) return null

  const markResolved = async () => {
    await updateCommunication(comm.id, { status: 'resolved' })
  }

  const addNote = async () => {
    if (!note.trim()) return
    const newNote = { id: `N-${Date.now()}`, author: 'You', text: note.trim(), createdAt: new Date().toISOString() }
    await updateCommunication(comm.id, { notes: [...(comm.notes||[]), newNote] })
    setNote('')
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'email': return '📧';
      case 'call': return '📞';
      case 'meeting': return '📅';
      case 'chat': return '💬';
      default: return '📝';
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", color: "#22c55e" };
      case 'follow_up': return { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.3)", color: "#fbbf24" };
      case 'pending': return { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#3b82f6" };
      default: return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
    }
  }

  const statusStyle = getStatusColor(comm.status);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "900px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <div>
              <h2>Communication Details</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <span style={{ fontSize: "20px" }}>{getTypeIcon(comm.type)}</span>
                <span style={{ 
                  fontSize: "11px", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  color: "var(--secondary)",
                  letterSpacing: "0.05em"
                }}>
                  {comm.type}
                </span>
                <span style={{ color: "var(--border)" }}>•</span>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  {new Date(comm.dateTime).toLocaleString()}
                </span>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-form">
            <div className="form-row" style={{ alignItems: "start" }}>
              <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Main Content Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: 'var(--foreground)' }}>
                      {comm.subject || 'No Subject'}
                    </h3>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      color: statusStyle.color,
                      textTransform: "capitalize"
                    }}>
                      {comm.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ color: 'var(--secondary)', lineHeight: 1.6, fontSize: "14px" }}>
                    {comm.body || 'No details provided'}
                  </div>
                  {comm.attachments && comm.attachments.length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                      <h4 style={{ fontSize: "12px", fontWeight: "600", color: 'var(--secondary)', textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Attachments
                      </h4>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {comm.attachments.map(a => (
                          <li key={a.id}>
                            <a 
                              href={a.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ color: "#3b82f6", fontSize: "13px", textDecoration: "none" }}
                            >
                              📎 {a.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: 'var(--secondary)', textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                    Internal Notes
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                    {(comm.notes||[]).length === 0 ? (
                      <div style={{ color: "var(--secondary)", fontSize: "13px", textAlign: "center", padding: "12px" }}>
                        No notes yet
                      </div>
                    ) : (
                      (comm.notes||[]).map(n=> (
                        <div key={n.id} style={{ 
                          border: '1px solid var(--border)', 
                          borderRadius: 8, 
                          padding: 12,
                          background: "var(--background)"
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "6px" }}>
                            <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--foreground)" }}>
                              {n.author}
                            </div>
                            <div style={{ color: 'var(--secondary)', fontSize: 11 }}>
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--foreground)" }}>{n.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input 
                      className="form-input" 
                      placeholder="Add internal note" 
                      value={note} 
                      onChange={(e)=>setNote(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-secondary" onClick={addNote}>Add Note</button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Overview Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: 'var(--secondary)', textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                    Overview
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>Agent</div>
                      <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: "14px" }}>
                        {comm.agent?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>Customer</div>
                      <div style={{ fontWeight: 500, color: 'var(--foreground)', fontSize: "14px" }}>
                        {comm.customer.name}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={markResolved}
                    style={{ width: "100%", marginTop: "16px" }}
                    disabled={comm.status === 'resolved'}
                  >
                    {comm.status === 'resolved' ? '✓ Resolved' : 'Mark as Resolved'}
                  </button>
                </div>

                {/* Timeline Card */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: 'var(--secondary)', textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                    Timeline
                  </h4>
                  <TimelineView items={ (comm.notes||[]).map(n=> ({ id: n.id, text: n.text, timestamp: n.createdAt })) } />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
