import { Target, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface Props { total: number; won: number; lost: number; totalValue: number }

export function OpportunityStatsCards({ total, won, lost, totalValue }: Props) {
  const cards = [
    { label: 'Total Opportunities', value: total, icon: Target },
    { label: 'Won Deals', value: won, icon: TrendingUp },
    { label: 'Lost Deals', value: lost, icon: Activity },
    { label: 'Total Pipeline Value', value: `$${(totalValue||0).toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>{c.value}</div>
              </div>
              <div style={{ padding: 8, borderRadius: 8, background: 'var(--background)' }}>
                <Icon size={20} color='var(--primary)' />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
