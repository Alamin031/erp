export type CommType = 'email' | 'call' | 'meeting' | 'chat'
export type CommStatus = 'resolved' | 'follow_up' | 'pending'

export interface Attachment { id: string; name: string; url?: string }

export interface Note { id: string; author: string; text: string; createdAt: string }

export interface Communication {
  id: string
  type: CommType
  status: CommStatus
  subject?: string
  summary?: string
  body?: string
  customer: { id: string; name: string }
  agent?: { id: string; name: string }
  dateTime: string
  attachments?: Attachment[]
  notes?: Note[]
  createdAt: string
  updatedAt?: string
}

export interface CommFilters {
  q?: string
  types?: CommType[]
  status?: CommStatus[]
  agentIds?: string[]
  dateFrom?: string
  dateTo?: string
}

export interface Pagination { page: number; pageSize: number }
