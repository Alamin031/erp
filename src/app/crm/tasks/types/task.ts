export type TaskStatus = 'open' | 'in_progress' | 'waiting' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface FollowUp {
  id: string
  note: string
  dueAt: string | null
  createdBy: { id: string; name: string }
  completed: boolean
  completedAt?: string
  reminder?: boolean
}

export interface Task {
  id: string
  subject: string
  description?: string
  contact?: { id: string; name: string; company?: string; phone?: string; email?: string }
  assignee?: { id: string; name: string; avatar?: string }
  priority: TaskPriority
  status: TaskStatus
  tags: string[]
  dueAt?: string | null
  createdAt: string
  updatedAt?: string
  followUps: FollowUp[]
  attachments?: { id: string; name: string; url?: string }[]
  notes?: Array<{ id: string; author: string; text: string; createdAt: string }>
}

export interface TaskFilters {
  q?: string
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeIds?: string[]
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  tab?: 'all' | 'mine' | 'today' | 'overdue' | 'followups'
}

export interface Pagination {
  page: number
  pageSize: number
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
