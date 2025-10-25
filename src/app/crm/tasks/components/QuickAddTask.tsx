"use client"

import { useState } from 'react'
import { useTasks } from '@/store/useTasks'
import { useToast } from '@/components/toast'

export function QuickAddTask() {
  const { addTask } = useTasks()
  const { showToast } = useToast()
  const [subject, setSubject] = useState('')
  const [contact, setContact] = useState('')
  const [dueAt, setDueAt] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return
    await addTask({
      subject: subject.trim(),
      description: '',
      contact: contact ? { id: `C-${Date.now()}`, name: contact } : undefined,
      assignee: undefined,
      priority: 'medium',
      status: 'open',
      tags: [],
      dueAt: dueAt || null,
      createdAt: new Date().toISOString(),
      followUps: [],
    } as any)
    setSubject(''); setContact(''); setDueAt('')
    showToast('Task added', 'success')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input className="form-input" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
      <input className="form-input" placeholder="Contact" value={contact} onChange={(e)=>setContact(e.target.value)} />
      <input type="datetime-local" className="form-input" value={dueAt} onChange={(e)=>setDueAt(e.target.value)} />
      <button className="btn btn-primary" disabled={!subject.trim()}>Quick Add</button>
    </form>
  )
}
