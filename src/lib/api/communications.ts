import type { Communication, CommFilters, Pagination } from '@/app/crm/communications/types/communication'

const USE_MOCK = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const DEMO_URL = '/demo/communications-demo.json'

function applyFilters(items: Communication[], filters?: CommFilters) {
  if (!filters) return items
  return items.filter(c => {
    if (filters.q) {
      const q = filters.q.toLowerCase()
      const hay = [c.subject, c.summary, c.body, c.customer?.name, c.agent?.name].filter(Boolean).join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.types && filters.types.length && !filters.types.includes(c.type)) return false
    if (filters.status && filters.status.length && !filters.status.includes(c.status)) return false
    if (filters.agentIds && filters.agentIds.length && (!c.agent || !filters.agentIds.includes(c.agent.id))) return false
    if (filters.dateFrom && new Date(c.dateTime) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(c.dateTime) > new Date(filters.dateTo)) return false
    return true
  })
}

export async function listCommunications(filters?: CommFilters, pagination: Pagination = { page: 1, pageSize: 10 }) {
  if (USE_MOCK) {
    const all: Communication[] = await fetch(DEMO_URL).then(r=>r.json()).catch(()=>[])
    const filtered = applyFilters(all, filters)
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return { items: filtered.slice(start,end), total: filtered.length, page: pagination.page, pageSize: pagination.pageSize }
  }
  const params = new URLSearchParams()
  if (filters?.q) params.set('q', filters.q)
  if (filters?.types?.length) params.set('types', filters.types.join(','))
  if (filters?.status?.length) params.set('status', filters.status.join(','))
  if (filters?.agentIds?.length) params.set('agentIds', filters.agentIds.join(','))
  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.set('dateTo', filters.dateTo)
  params.set('page', String(pagination.page))
  params.set('pageSize', String(pagination.pageSize))
  const resp = await fetch(`/api/communications?${params.toString()}`)
  if (!resp.ok) throw new Error('Failed to list communications')
  return resp.json()
}

export async function createCommunication(payload: Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>) {
  if (USE_MOCK) {
    const now = new Date().toISOString()
    return Promise.resolve({ ...payload, id: `C-${Date.now()}`, createdAt: now })
  }
  const resp = await fetch('/api/communications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!resp.ok) throw new Error('Failed to create')
  return resp.json()
}

export async function updateCommunication(id: string, patch: Partial<Communication>) {
  if (USE_MOCK) return Promise.resolve({ ...patch, id })
  const resp = await fetch(`/api/communications/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
  if (!resp.ok) throw new Error('Failed to update')
  return resp.json()
}

export async function deleteCommunication(id: string) {
  if (USE_MOCK) return Promise.resolve()
  const resp = await fetch(`/api/communications/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!resp.ok) throw new Error('Failed to delete')
}
