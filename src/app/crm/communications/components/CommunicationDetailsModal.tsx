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

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal>
        <div className="modal-header">
          <h2>Communication Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div className="form-row">
            <div style={{ flex: 2 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{comm.type.toUpperCase()} • {new Date(comm.dateTime).toLocaleString()}</div>
                <h3 style={{ marginTop: 8, color: 'var(--foreground)' }}>{comm.subject}</h3>
                <div style={{ color: 'var(--secondary)', marginTop: 8 }}>{comm.body}</div>
                {comm.attachments && comm.attachments.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <h4 className="text-sm" style={{ color: 'var(--secondary)' }}>Attachments</h4>
                    <ul>
                      {comm.attachments.map(a => <li key={a.id}><a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600">{a.name}</a></li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 className="text-sm" style={{ color: 'var(--secondary)' }}>Notes</h4>
                <div className="flex flex-col gap-2">
                  {(comm.notes||[]).map(n=> (
                    <div key={n.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 600 }}>{n.author}</div>
                        <div style={{ color: 'var(--secondary)', fontSize: 12 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ marginTop: 6 }}>{n.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input className="form-input" placeholder="Add internal note" value={note} onChange={(e)=>setNote(e.target.value)} />
                  <button className="btn btn-secondary" onClick={addNote}>Add Note</button>
                </div>
              </div>
            </div>

            <aside style={{ flex: 1 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                <div style={{ color: 'var(--secondary)' }}>Overview</div>
                <div style={{ fontWeight: 600, color: 'var(--foreground)', marginTop: 6 }}>{comm.agent?.name || 'Unassigned'}</div>
                <div style={{ color: 'var(--secondary)', marginTop: 6 }}>{comm.customer.name}</div>
                <div className="flex flex-col gap-2 mt-4">
                  <button className="btn btn-primary" onClick={markResolved}>Mark as Resolved</button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 className="text-sm" style={{ color: 'var(--secondary)' }}>Timeline</h4>
                <TimelineView items={ (comm.notes||[]).map(n=> ({ id: n.id, text: n.text, timestamp: n.createdAt })) } />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
