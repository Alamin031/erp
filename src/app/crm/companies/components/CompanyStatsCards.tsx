import { Building, TrendingUp, Users, Briefcase } from 'lucide-react';

interface Props { total: number; activeClients: number; prospects: number; avgEmployees: number }

export function CompanyStatsCards({ total, activeClients, prospects, avgEmployees }: Props) {
  const cards = [
    { label: 'Total Companies', value: total, icon: Building },
    { label: 'Active Clients', value: activeClients, icon: Users },
    { label: 'Prospects', value: prospects, icon: Briefcase },
    { label: 'Avg Employees', value: avgEmployees, icon: TrendingUp },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
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
