"use client";

import { useActivities } from '@/store/useActivities';

interface Props { onQuickAdd?: (date: string)=>void }

export function CalendarView({ onQuickAdd }: Props) {
  const { activities } = useActivities();
  // Simple placeholder: show next 7 days with counts
  const days: { date: string; count: number }[] = [];
  for (let i=0;i<7;i++){
    const d = new Date(); d.setDate(d.getDate()+i);
    const iso = d.toISOString().slice(0,10);
    const count = activities.filter(a => a.dateTime.slice(0,10) === iso).length;
    days.push({ date: iso, count });
  }

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
      {days.map(d => (
        <div key={d.date} style={{ minWidth: 120, padding: 12, borderRadius: 8, background: 'var(--card-bg)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => onQuickAdd?.(d.date)}>
          <div style={{ fontWeight: 700 }}>{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          <div style={{ color: 'var(--secondary)', marginTop: 6 }}>{d.count} activities</div>
        </div>
      ))}
    </div>
  );
}
