"use client"

import { useMemo } from 'react'
import type { Communication } from '../types/communication'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export function CommunicationTypeChart({ items }: { items: Communication[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = { email:0, call:0, meeting:0, chat:0 }
    items.forEach(i=> map[i.type] = (map[i.type] || 0) + 1)
    return Object.keys(map).map(k=>({ name: k, value: map[k] }))
  }, [items])
  const COLORS = ['#3b82f6','#10b981','#6366f1','#f59e0b']
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={70} innerRadius={36}>
            {data.map((_,i)=> <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
