"use client"

import { useState } from 'react'
import { useCommunications } from '@/store/useCommunications'
import { useToast } from '@/components/toast'

export function AddNoteModal({ isOpen, onClose, commId }: { isOpen: boolean; onClose: ()=>void; commId: string | null }) {
  const { getById, updateCommunication } = useCommunications()
  const comm = commId ? getById(commId) : null
  const [text, setText] = useState('')
  const { showToast } = useToast()
  if (!isOpen || !comm) return null
  const save = async () => {
    if (!text.trim()) return
    const note = { id: `N-${Date.now()}`, author: 'You', text: text.trim(), createdAt: new Date().toISOString() }
    await updateCommunication(comm.id, { notes: [...(comm.notes||[]), note] })
    showToast('Note added', 'success')
    setText('')
    onClose()
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal>
        <div className="modal-header">
          <h2>Add Note</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <textarea className="form-input" rows={6} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Markdown supported" />
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </>
  )
}
