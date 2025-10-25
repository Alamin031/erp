"use client"

import { useState, useEffect } from 'react'
import { useCommunications } from '@/store/useCommunications'

export function SearchBar() {
  const { searchCommunications } = useCommunications()
  const [q, setQ] = useState('')
  useEffect(()=>{
    const t = setTimeout(()=> searchCommunications(q), 300)
    return ()=> clearTimeout(t)
  }, [q])

  return (
    <input className="form-input" placeholder="Search by customer, subject or agent" value={q} onChange={(e)=>setQ(e.target.value)} style={{ minWidth: 240 }} />
  )
}
