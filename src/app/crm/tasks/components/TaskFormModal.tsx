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
          createdAt: new Date().toISOString(),
          followUps: [] as FollowUp[],
        }
        const created = await addTask(draft as any)
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
          style={{ maxWidth: 720 }}
        >
          <div className="modal-header">
            <h2 id="task-form-title">{task ? 'Edit Task' : 'Create Task'}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
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

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} placeholder="Details" {...register('description')} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact</label>
                <input className="form-input" placeholder="Name" {...register('contactName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" placeholder="Company" {...register('contactCompany')} />
              </div>
            </div>

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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input className="form-input" placeholder="Comma separated" {...register('tags')} />
              </div>
              <div className="form-group">
                <label className="form-label">Reminder</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register('reminder')} />
                  <input type="datetime-local" className="form-input" {...register('reminderAt')} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('addFollowUp')} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Add follow-up</span>
              </div>
              <div className="form-row" style={{ marginTop: 8 }}>
                <div className="form-group">
                  <label className="form-label">Note</label>
                  <input className="form-input" placeholder="Follow-up note" {...register('followUpNote')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Due</label>
                  <input type="datetime-local" className="form-input" {...register('followUpDueAt')} />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <div className="flex gap-2">
                <button name="save_add" value="1" className="btn btn-secondary" disabled={isSubmitting}>Save & Add Another</button>
                <button className="btn btn-primary" disabled={isSubmitting}>Save & Close</button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
