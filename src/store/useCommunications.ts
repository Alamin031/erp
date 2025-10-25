import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Communication, CommFilters, Pagination } from '@/app/crm/communications/types/communication'
import * as api from '@/lib/api/communications'

interface CommStore {
  communications: Communication[]
  total: number
  isLoading: boolean
  filters: CommFilters
  pagination: Pagination
  activity: Array<{ id: string; text: string; timestamp: string }>

  fetchCommunications: (filters?: CommFilters, pagination?: Pagination) => Promise<void>
  addCommunication: (payload: Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Communication>
  updateCommunication: (id: string, patch: Partial<Communication>) => Promise<void>
  deleteCommunication: (id: string) => Promise<void>
  setFilter: (f: CommFilters) => void
  searchCommunications: (q: string) => void
  getById: (id: string) => Communication | null
}

export const useCommunications = create<CommStore>()(
  persist((set, get) => ({
    communications: [],
    total: 0,
    isLoading: false,
    filters: {},
    pagination: { page: 1, pageSize: 10 },
    activity: [],

    fetchCommunications: async (filters, pagination) => {
      set({ isLoading: true })
      try {
        const f = { ...(get().filters || {}), ...(filters || {}) }
        const p = pagination || get().pagination
        const res = await api.listCommunications(f, p)
        set({ communications: res.items, total: res.total, filters: f, pagination: { page: res.page, pageSize: res.pageSize } })
      } catch (e) {
        console.error('Failed to fetch communications', e)
      } finally { set({ isLoading: false }) }
    },

    addCommunication: async (payload) => {
      const created = await api.createCommunication(payload)
      set(state => ({ communications: [created, ...state.communications], total: state.total + 1, activity: [{ id: `ACT-${Date.now()}`, text: `Communication created: ${created.subject || created.type}`, timestamp: new Date().toISOString() }, ...state.activity] }))
      return created
    },

    updateCommunication: async (id, patch) => {
      const updated = await api.updateCommunication(id, patch)
      set(state => ({ communications: state.communications.map(c => c.id === id ? { ...c, ...patch, updatedAt: (updated as any).updatedAt || new Date().toISOString() } : c), activity: [{ id: `ACT-${Date.now()}`, text: `Communication updated: ${id}`, timestamp: new Date().toISOString() }, ...state.activity] }))
    },

    deleteCommunication: async (id) => {
      await api.deleteCommunication(id)
      set(state => ({ communications: state.communications.filter(c => c.id !== id), total: Math.max(0, state.total - 1), activity: [{ id: `ACT-${Date.now()}`, text: `Communication deleted: ${id}`, timestamp: new Date().toISOString() }, ...state.activity] }))
    },

    setFilter: (f) => set(state => ({ filters: { ...state.filters, ...f } })),
    searchCommunications: (q) => { set(state => ({ filters: { ...state.filters, q } })); get().fetchCommunications({ ...get().filters, q }, { page: 1, pageSize: get().pagination.pageSize }) },
    getById: (id) => get().communications.find(c => c.id === id) || null,
  }), { name: 'communications-store' })
)
