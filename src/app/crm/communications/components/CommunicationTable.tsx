"use client"

import { useState } from 'react'
import type { Communication } from '../types/communication'
import { useCommunications } from '@/store/useCommunications'

export function CommunicationTable({ items, onView, onEdit }: { items: Communication[]; onView: (id:string)=>void; onEdit: (id:string)=>void }) {
  const { deleteCommunication, isLoading } = useCommunications()
  const [page, setPage] = useState(1)

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <table className="w-full">
        <thead style={{ background: 'var(--card-bg)' }}>
          <tr>
            <th className="px-4 py-2 text-left">Date & Time</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Subject / Summary</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Agent</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && Array.from({ length: 4 }).map((_,i)=> (
            <tr key={i}><td colSpan={7} className="px-4 py-6"><div className="animate-pulse h-4 bg-[var(--border)] rounded" /></td></tr>
          ))}
          {!isLoading && items.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-6 text-center text-[var(--secondary)]">No communications</td></tr>
          )}
          {!isLoading && items.map(it => (
            <tr key={it.id} className="hover:bg-[var(--sidebar-hover)] cursor-pointer" onClick={(e)=>{ if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') onView(it.id) }}>
              <td className="px-4 py-3 text-sm">{new Date(it.dateTime).toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{it.type}</td>
              <td className="px-4 py-3 text-sm">{it.customer.name}</td>
              <td className="px-4 py-3 text-sm">{it.subject || it.summary}</td>
              <td className="px-4 py-3 text-sm">{it.status}</td>
              <td className="px-4 py-3 text-sm">{it.agent?.name || '—'}</td>
              <td className="px-4 py-3 text-sm flex gap-2">
                <button onClick={(e)=>{ e.stopPropagation(); onView(it.id) }} className="text-blue-600">View</button>
                <button onClick={(e)=>{ e.stopPropagation(); onEdit(it.id) }} className="text-green-600">Edit</button>
                <button onClick={async (e)=>{ e.stopPropagation(); if(confirm('Delete?')) await deleteCommunication(it.id) }} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
        <button className="btn btn-secondary" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <div className="text-sm text-[var(--secondary)]">Page {page}</div>
        <button className="btn btn-secondary" onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
