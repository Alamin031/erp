import { Users, Building, UserPlus, TrendingUp } from "lucide-react";

interface Props { total: number; customers: number; prospects: number; activeThisMonth: number }

export function ContactStatsCards({ total, customers, prospects, activeThisMonth }: Props) {
  const cards = [
    { label: "Total Contacts", value: total, icon: Users },
    { label: "Customers", value: customers, icon: Building },
    { label: "Prospects", value: prospects, icon: UserPlus },
    { label: "Active This Month", value: activeThisMonth, icon: TrendingUp },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card-bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--secondary)", fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)" }}>{c.value}</div>
              </div>
              <div style={{ padding: 8, borderRadius: 8, background: "var(--background)" }}>
                <Icon size={20} color="var(--primary)" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
