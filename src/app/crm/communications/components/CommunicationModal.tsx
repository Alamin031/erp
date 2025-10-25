"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Communication } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'
import { useUsers } from '@/store/useUsers'
import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/components/toast'

const schema = z.object({
  type: z.enum(['email','call','meeting','chat']),
  customerId: z.string().min(1),
  subject: z.string().optional(),
  body: z.string().optional(),
  dateTime: z.string().min(1),
  status: z.enum(['resolved','follow_up','pending']),
  agentId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CommunicationModal({ isOpen, onClose, entry }: { isOpen: boolean; onClose: ()=>void; entry?: Communication | null }) {
  const { addCommunication, updateCommunication } = useCommunications()
  const users = useUsers((s)=>s.users)
  const { showToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { type: 'email', customerId: '', subject: '', body: '', dateTime: '', status: 'pending', agentId: '' } })

  useEffect(()=>{
    if (entry) {
      reset({ type: entry.type, customerId: entry.customer.id, subject: entry.subject || '', body: entry.body || '', dateTime: entry.dateTime, status: entry.status, agentId: entry.agent?.id || '' })
    } else reset()
  }, [entry, reset])

  const onSubmit = async (v: FormValues) => {
    try {
      const payload = {
        type: v.type,
        status: v.status,
        subject: v.subject,
        body: v.body,
        customer: { id: v.customerId, name: v.customerId },
        agent: v.agentId ? { id: v.agentId, name: users.find(u=>u.id===v.agentId)?.name || v.agentId } : undefined,
        dateTime: v.dateTime,
        attachments: [],
      }
      if (entry) await updateCommunication(entry.id, payload)
      else await addCommunication(payload as any)
      showToast('Saved', 'success')
      onClose()
    } catch (e) { console.error(e); showToast('Failed', 'error') }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <AnimatePresence>
        <motion.div className="modal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.18 }} role="dialog" aria-modal>
          <div className="modal-header">
            <h2>{entry ? 'Edit Communication' : 'Add Communication'}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" {...register('type')}>
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="chat">Chat</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Customer</label>
                <input className="form-input" placeholder="Customer id/name" {...register('customerId')} />
                {errors.customerId && <div className="form-error">{errors.customerId.message}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" {...register('subject')} />
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Body</label>
              <textarea className="form-input" rows={6} {...register('body')} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-input" {...register('dateTime')} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" {...register('status')}>
                  <option value="pending">Pending</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Agent</label>
                <select className="form-input" {...register('agentId')}>
                  <option value="">Unassigned</option>
                  {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary">Save</button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
