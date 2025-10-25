"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommunications } from '@/store/useCommunications'

export function CommunicationActivityFeed() {
  const { activity } = useCommunications()

  useEffect(()=>{
    // placeholder for websocket or polling
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {activity.map(a => (
          <motion.div key={a.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--foreground)' }}>{a.text}</div>
            <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{new Date(a.timestamp).toLocaleString()}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
