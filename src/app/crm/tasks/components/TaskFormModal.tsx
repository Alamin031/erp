"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Task, TaskPriority, TaskStatus, FollowUp } from '@/app/crm/tasks/types/task'
import { useTasks } from '@/store/useTasks'
import { useUsers } from '@/store/useUsers'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/toast'

const schema = z.object({
  subject: z.string().min(2, 'Subject is required'),
  description: z.string().optional(),
  contactName: z.string().optional(),
  contactCompany: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['low','medium','high','urgent']),
  status: z.enum(['open','in_progress','waiting','done','cancelled']),
  dueAt: z.string().optional(),
  reminder: z.boolean().optional(),
  reminderAt: z.string().optional(),
  tags: z.string().optional(),
  addFollowUp: z.boolean().optional(),
  followUpNote: z.string().optional(),
  followUpDueAt: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function TaskFormModal({ isOpen, onClose, task }: { isOpen: boolean; onClose: () => void; task?: Task | null }) {
  const { addTask, updateTask } = useTasks()
  const users = useUsers((s) => s.users)
  const { showToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: '', description: '', contactName: '', contactCompany: '', assigneeId: '', priority: 'medium', status: 'open', dueAt: '', reminder: false, reminderAt: '', tags: '', addFollowUp: false, followUpNote: '', followUpDueAt: ''
    }
  })

  useEffect(() => {
    if (task) {
      reset({
        subject: task.subject,
        description: task.description || '',
        contactName: task.contact?.name || '',
        contactCompany: task.contact?.company || '',
        assigneeId: task.assignee?.id || '',
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus,
        dueAt: task.dueAt || '',
        tags: (task.tags || []).join(', '),
        reminder: false,
        reminderAt: '',
        addFollowUp: false,
        followUpNote: '',
        followUpDueAt: ''
      })
    } else {
      reset()
    }
  }, [task, reset])

  const onSubmit = async (values: FormValues, e?: any) => {
    const tagList = values.tags ? values.tags.split(',').map(t=>t.trim()).filter(Boolean) : []
    try {
      if (task) {
        await updateTask(task.id, {
          subject: values.subject,
          description: values.description,
          contact: values.contactName ? { id: task.contact?.id || `C-${Date.now()}`, name: values.contactName, company: values.contactCompany } : undefined,
          assignee: values.assigneeId ? (users.find(u=>u.id===values.assigneeId) ? { id: values.assigneeId, name: users.find(u=>u.id===values.assigneeId)!.name, avatar: users.find(u=>u.id===values.assigneeId)!.image } : { id: values.assigneeId, name: values.assigneeId }) : undefined,
          priority: values.priority,
          status: values.status,
          dueAt: values.dueAt || null,
          tags: tagList,
        })
        if (values.addFollowUp && values.followUpNote) {
          const fu: Omit<FollowUp,'id'|'completed'> = { note: values.followUpNote, dueAt: values.followUpDueAt || null, createdBy: { id: values.assigneeId || 'system', name: users.find(u=>u.id===values.assigneeId)?.name || 'System' } }
          await useTasks.getState().addFollowUp(task.id, fu)
        }
        showToast('Task updated', 'success')
      } else {
        const draft = {
          subject: values.subject,
          description: values.description,
          contact: values.contactName ? { id: `C-${Date.now()}`, name: values.contactName, company: values.contactCompany } : undefined,
          assignee: values.assigneeId ? (users.find(u=>u.id===values.assigneeId) ? { id: values.assigneeId, name: users.find(u=>u.id===values.assigneeId)!.name, avatar: users.find(u=>u.id===values.assigneeId)!.image } : { id: values.assigneeId, name: values.assigneeId }) : undefined,
          priority: values.priority as TaskPriority,
          status: values.status as TaskStatus,
          tags: tagList,
          dueAt: values.dueAt || null,
        }
        const created = await addTask(draft)
        if (values.addFollowUp && values.followUpNote) {
          const fu: Omit<FollowUp,'id'|'completed'> = { note: values.followUpNote, dueAt: values.followUpDueAt || null, createdBy: { id: created.assignee?.id || 'system', name: created.assignee?.name || 'System' } }
          await useTasks.getState().addFollowUp(created.id, fu)
        }
        showToast('Task created', 'success')
      }
      if (e?.nativeEvent?.submitter?.name === 'save_add') {
        reset()
      } else {
        onClose()
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to save task', 'error')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          className="modal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal
          aria-labelledby="task-form-title"
          style={{ zIndex: 1001 }}
        >
          <div className="modal-card" style={{ maxWidth: "850px", maxHeight: "90vh", overflow: "auto" }}>
            <div className="modal-header">
              <h2 id="task-form-title">{task ? 'Edit Task' : 'Create Task'}</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
              {/* Subject & Assignee */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input className="form-input" placeholder="Task subject" {...register('subject')} />
                  {errors.subject && <div className="form-error">{errors.subject.message}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select className="form-input" {...register('assigneeId')}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  placeholder="Details" 
                  {...register('description')}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </div>

              {/* Contact & Company */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <input className="form-input" placeholder="Priya Singh" {...register('contactName')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Orion" {...register('contactCompany')} />
                </div>
              </div>

              {/* Priority, Status & Due Date */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" {...register('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" {...register('status')}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting">Waiting</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date & Time</label>
                  <input type="datetime-local" className="form-input" {...register('dueAt')} />
                </div>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input className="form-input" placeholder="billing, urgent, follow-up (comma separated)" {...register('tags')} />
                <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                  Separate multiple tags with commas
                </p>
              </div>

              {/* Reminder Section */}
              <div className="form-group" style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <input 
                    type="checkbox" 
                    {...register('reminder')}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label className="form-label" style={{ marginBottom: 0, cursor: "pointer" }}>Set Reminder</label>
                </div>
                <input 
                  type="datetime-local" 
                  className="form-input" 
                  {...register('reminderAt')}
                  placeholder="Select reminder date & time"
                />
              </div>

              {/* Follow-up Section */}
              <div className="form-group" style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <input 
                    type="checkbox" 
                    {...register('addFollowUp')}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--foreground)", cursor: "pointer" }}>
                    Add follow-up
                  </span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Follow-up Note</label>
                    <input className="form-input" placeholder="Follow-up note" {...register('followUpNote')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Due</label>
                    <input type="datetime-local" className="form-input" {...register('followUpDueAt')} />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    type="submit"
                    name="save_add" 
                    value="1" 
                    className="btn btn-secondary" 
                    disabled={isSubmitting}
                  >
                    Save & Add Another
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                  >
                    {task ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
