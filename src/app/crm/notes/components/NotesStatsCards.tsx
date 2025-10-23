"use client";

import { useMemo } from 'react';
import { FileText, Users, Building, Briefcase } from 'lucide-react';
import { useNotes } from '@/store/useNotes';

export function NotesStatsCards() {
  const notes = useNotes(s => s.notes);

  const stats = useMemo(() => ({
    total: notes.length,
    contacts: notes.filter(n => n.linkedEntityType === 'Contact').length,
    companies: notes.filter(n => n.linkedEntityType === 'Company').length,
    deals: notes.filter(n => n.linkedEntityType === 'Deal').length,
  }), [notes]);

  const Card = ({ title, value, icon }: { title: string; value: number; icon: any }) => (
    <div style={{ borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(148,163,184,0.04)', padding: 12, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{title}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 12 }}>
      <Card title="Total Notes" value={stats.total} icon={<FileText />} />
      <Card title="Notes (Contacts)" value={stats.contacts} icon={<Users />} />
      <Card title="Notes (Companies)" value={stats.companies} icon={<Building />} />
      <Card title="Notes (Deals)" value={stats.deals} icon={<Briefcase />} />
    </div>
  );
}
