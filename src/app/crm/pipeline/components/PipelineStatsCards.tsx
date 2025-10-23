import { Target, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface Props { total: number; pipelineValue: number; winRate: number; avgDealSize: number }

export function PipelineStatsCards({ total, pipelineValue, winRate, avgDealSize }: Props) {
  const cards = [
    { label: 'Total Opportunities', value: total, icon: Target },
    { label: 'Total Pipeline Value', value: `$${(pipelineValue||0).toLocaleString()}`, icon: DollarSign },
    { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp },
    { label: 'Avg Deal Size', value: `$${(avgDealSize||0).toLocaleString()}`, icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
      {cards.map(c=>{
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ padding: 14, borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
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
