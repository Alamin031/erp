"use client"

import { useEffect, useState } from 'react'
import { useCommunications } from '@/store/useCommunications'
import { CommunicationTable } from './components/CommunicationTable'
import { CommunicationModal } from './components/CommunicationModal'
import { CommunicationDetailsModal } from './components/CommunicationDetailsModal'
import { CommunicationStatsCards } from './components/CommunicationStatsCards'
import { CommunicationTypeChart } from './components/CommunicationTypeChart'
import { FilterBar } from './components/FilterBar'
import { SearchBar } from './components/SearchBar'
import { CommunicationActivityFeed } from './components/CommunicationActivityFeed'
import { AddNoteModal } from './components/AddNoteModal'

export function CommunicationsPageClient() {
  const { communications, fetchCommunications, isLoading } = useCommunications()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)

  useEffect(()=>{ fetchCommunications() }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Communication Log</h1>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>Track all communication history with customers</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" onClick={()=>{ setEditId(null); setIsModalOpen(true) }}>+ Add Communication</button>
        </div>
      </div>

      <div className="mb-4">
        <CommunicationStatsCards items={communications} />
      </div>

      <div className="mb-4">
        <FilterBar>
          <SearchBar />
        </FilterBar>
      </div>

      {/* Communication Table - Full Width */}
      <div className="mb-4">
        <CommunicationTable items={communications} onView={(id)=>setViewId(id)} onEdit={(id)=>{ setEditId(id); setIsModalOpen(true) }} />
      </div>

      {/* Bottom Section - Chart and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <CommunicationTypeChart items={communications} />
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Feed</h3>
          <CommunicationActivityFeed />
        </div>
      </div>

      <CommunicationModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} entry={editId ? useCommunications.getState().getById(editId) : undefined} />
      <CommunicationDetailsModal id={viewId} isOpen={!!viewId} onClose={()=>setViewId(null)} />
      <AddNoteModal isOpen={noteOpen} onClose={()=>setNoteOpen(false)} commId={viewId} />
    </div>
  )
}
