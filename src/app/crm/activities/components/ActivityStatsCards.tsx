import { PhoneCall, Calendar, Mail, Clock } from 'lucide-react';

interface Props { total: number; callsToday: number; meetings: number; pendingFollowUps: number }

export function ActivityStatsCards({ total, callsToday, meetings, pendingFollowUps }: Props) {
  const cards = [
    { label: 'Total Activities', value: total, icon: PhoneCall },
    { label: 'Calls Today', value: callsToday, icon: Calendar },
    { label: 'Meetings Scheduled', value: meetings, icon: Mail },
    { label: 'Pending Follow-Ups', value: pendingFollowUps, icon: Clock },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
      {cards.map(c=>{
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>{c.value}</div>
              </div>
              <div style={{ background: 'var(--background)', padding: 8, borderRadius: 8 }}><Icon size={18} color='var(--primary)' /></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
