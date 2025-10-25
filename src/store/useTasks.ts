import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskFilters, Pagination, FollowUp } from '@/app/crm/tasks/types/task'
import * as api from '@/lib/api/tasks'
import { useUsers } from '@/store/useUsers'

interface TasksStore {
  tasks: Task[]
  total: number
  isLoading: boolean
  filters: TaskFilters
  pagination: Pagination
  activity: Array<{ id: string; text: string; timestamp: string }>

  fetchTasks: (filters?: TaskFilters, pagination?: Pagination) => Promise<void>
  addTask: (draft: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'followUps'> & { followUps?: FollowUp[] }) => Promise<Task>
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  addFollowUp: (taskId: string, fu: Omit<FollowUp, 'id' | 'completed'>) => Promise<void>
  completeFollowUp: (taskId: string, followUpId: string) => void
  markTaskDone: (id: string) => void
  assignTask: (id: string, assigneeId: string) => void
  getTaskById: (id: string) => Task | null
  getCounts: () => { total: number; overdue: number; dueToday: number; followupsDue: number }
}

export const useTasks = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      total: 0,
      isLoading: false,
      filters: { tab: 'all' },
      pagination: { page: 1, pageSize: 10 },
      activity: [],

      fetchTasks: async (filters, pagination) => {
        set({ isLoading: true })
        try {
          const f = { ...(get().filters || {}), ...(filters || {}) }
          const p = pagination || get().pagination
          const res = await api.listTasks(f, p)
          set({ tasks: res.items, total: res.total, filters: f, pagination: { page: res.page, pageSize: res.pageSize } })
        } catch (e) {
          console.error('Failed to fetch tasks', e)
        } finally {
          set({ isLoading: false })
        }
      },

      addTask: async (draft) => {
        const created = await api.createTask(draft)
        set((state) => ({
          tasks: [created, ...state.tasks],
          total: state.total + 1,
          activity: [
            { id: `A-${Date.now()}`, text: `Task created: ${created.subject}`, timestamp: new Date().toISOString() },
            ...state.activity,
          ],
        }))
        return created
      },

      updateTask: async (id, patch) => {
        const updated = await api.updateTask(id, patch)
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: updated.updatedAt || new Date().toISOString() } : t)),
          activity: [
            { id: `A-${Date.now()}`, text: `Task updated: ${id}`, timestamp: new Date().toISOString() },
            ...state.activity,
          ],
        }))
      },

      deleteTask: async (id) => {
        await api.deleteTask(id)
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          total: Math.max(0, state.total - 1),
          activity: [
            { id: `A-${Date.now()}`, text: `Task deleted: ${id}`, timestamp: new Date().toISOString() },
            ...state.activity,
          ],
        }))
      },

      addFollowUp: async (taskId, fu) => {
        const created = await api.createFollowUp(taskId, fu)
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, followUps: [...(t.followUps || []), created] } : t)),
          activity: [
            { id: `A-${Date.now()}`, text: `Follow-up added to ${taskId}`, timestamp: new Date().toISOString() },
            ...state.activity,
          ],
        }))
      },

      completeFollowUp: (taskId, followUpId) => {
        const now = new Date().toISOString()
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  followUps: (t.followUps || []).map((f) => (f.id === followUpId ? { ...f, completed: true, completedAt: now } : f)),
                }
              : t
          ),
          activity: [
            { id: `A-${Date.now()}`, text: `Follow-up completed ${followUpId}`, timestamp: now },
            ...state.activity,
          ],
        }))
      },

      markTaskDone: (id) => {
        const now = new Date().toISOString()
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'done', updatedAt: now } : t)),
          activity: [
            { id: `A-${Date.now()}`, text: `Task marked done: ${id}`, timestamp: now },
            ...state.activity,
          ],
        }))
      },

      assignTask: (id, assigneeId) => {
        const user = useUsers.getState().getUserById(assigneeId)
        const assignee = user ? { id: user.id, name: user.name, avatar: user.image } : { id: assigneeId, name: assigneeId }
        const now = new Date().toISOString()
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, assignee, updatedAt: now } : t)),
          activity: [
            { id: `A-${Date.now()}`, text: `Task ${id} assigned to ${assignee.name}`, timestamp: now },
            ...state.activity,
          ],
        }))
      },

      getTaskById: (id) => get().tasks.find((t) => t.id === id) || null,

      getCounts: () => {
        const tasks = get().tasks
        const total = tasks.length
        const today = new Date()
        const dueToday = tasks.filter((t) => t.dueAt && new Date(t.dueAt).toDateString() === today.toDateString()).length
        const overdue = tasks.filter((t) => {
          if (!t.dueAt) return false
          const d = new Date(t.dueAt)
          return d < today && t.status !== 'done' && t.status !== 'cancelled'
        }).length
        const followupsDue = tasks.reduce((sum, t) => sum + (t.followUps || []).filter((f) => {
          if (!f.dueAt || f.completed) return false
          const d = new Date(f.dueAt)
          return d <= today
        }).length, 0)
        return { total, overdue, dueToday, followupsDue }
      },
    }),
    { name: 'crm-tasks-store' }
  )
)
