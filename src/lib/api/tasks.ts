import type { Task, FollowUp, TaskFilters, Pagination, PagedResult } from '@/app/crm/tasks/types/task'

const USE_MOCK = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK === 'true'

const DEMO_URL = '/demo/demoTasks.json'

function applyFilters(items: Task[], filters?: TaskFilters): Task[] {
  if (!filters) return items
  const today = new Date()
  return items.filter((t) => {
    if (filters.q) {
      const q = filters.q.toLowerCase()
      const hay = [t.id, t.subject, t.description, t.contact?.name, t.contact?.company, t.assignee?.name, ...(t.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.status && filters.status.length && !filters.status.includes(t.status)) return false
    if (filters.priority && filters.priority.length && !filters.priority.includes(t.priority)) return false
    if (filters.assigneeIds && filters.assigneeIds.length && (!t.assignee || !filters.assigneeIds.includes(t.assignee.id))) return false
    if (filters.tags && filters.tags.length && !filters.tags.every(tag => (t.tags || []).includes(tag))) return false
    if (filters.dateFrom && t.dueAt && new Date(t.dueAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && t.dueAt && new Date(t.dueAt) > new Date(filters.dateTo)) return false
    if (filters.tab === 'today') {
      if (!t.dueAt) return false
      const d = new Date(t.dueAt)
      if (d.toDateString() !== today.toDateString()) return false
    }
    if (filters.tab === 'overdue') {
      if (!t.dueAt) return false
      const d = new Date(t.dueAt)
      if (d >= today || t.status === 'done' || t.status === 'cancelled') return false
    }
    return true
  })
}

export async function listTasks(filters?: TaskFilters, pagination: Pagination = { page: 1, pageSize: 10 }): Promise<PagedResult<Task>> {
  if (USE_MOCK) {
    const all: Task[] = await fetch(DEMO_URL).then(r => r.json()).catch(() => [])
    const filtered = applyFilters(all, filters)
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    const items = filtered.slice(start, end)
    return { items, total: filtered.length, page: pagination.page, pageSize: pagination.pageSize }
  }
  // Real API wiring placeholder: replace with your backend endpoint
  const params = new URLSearchParams()
  if (filters?.q) params.set('q', filters.q)
  if (filters?.status?.length) params.set('status', filters.status.join(','))
  if (filters?.priority?.length) params.set('priority', filters.priority.join(','))
  if (filters?.assigneeIds?.length) params.set('assigneeIds', filters.assigneeIds.join(','))
  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.set('dateTo', filters.dateTo)
  if (filters?.tags?.length) params.set('tags', filters.tags.join(','))
  params.set('page', String(pagination.page))
  params.set('pageSize', String(pagination.pageSize))
  const resp = await fetch(`/api/tasks?${params.toString()}`)
  if (!resp.ok) throw new Error('Failed to list tasks')
  return resp.json()
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'followUps'> & { followUps?: FollowUp[] }): Promise<Task> {
  if (USE_MOCK) {
    const now = new Date().toISOString()
    const task: Task = { ...payload, id: `T-${Date.now()}`, createdAt: now, updatedAt: now, followUps: payload.followUps ?? [] }
    return Promise.resolve(task)
  }
  const resp = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!resp.ok) throw new Error('Failed to create task')
  return resp.json()
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  if (USE_MOCK) {
    const now = new Date().toISOString()
    return Promise.resolve({ id, ...patch, updatedAt: now } as Task)
  }
  const resp = await fetch(`/api/tasks/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
  if (!resp.ok) throw new Error('Failed to update task')
  return resp.json()
}

export async function deleteTask(id: string): Promise<void> {
  if (USE_MOCK) return Promise.resolve()
  const resp = await fetch(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!resp.ok) throw new Error('Failed to delete task')
}

export async function listFollowUps(taskId: string): Promise<FollowUp[]> {
  if (USE_MOCK) {
    const all: Task[] = await fetch(DEMO_URL).then(r => r.json()).catch(() => [])
    return all.find(t => t.id === taskId)?.followUps ?? []
  }
  const resp = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/follow-ups`)
  if (!resp.ok) throw new Error('Failed to list follow-ups')
  return resp.json()
}

export async function createFollowUp(taskId: string, payload: Omit<FollowUp, 'id' | 'completed'>): Promise<FollowUp> {
  if (USE_MOCK) {
    const fu: FollowUp = { ...payload, id: `F-${Date.now()}`, completed: false }
    return Promise.resolve(fu)
  }
  const resp = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/follow-ups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!resp.ok) throw new Error('Failed to create follow-up')
  return resp.json()
}
