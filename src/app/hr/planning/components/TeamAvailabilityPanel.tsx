"use client";

import { useMemo, useState } from "react";
import { usePlanning } from "@/store/usePlanning";

export function TeamAvailabilityPanel() {
  const { employees, shifts } = usePlanning();
  const [q, setQ] = useState('');

  const statuses = useMemo(() => {
    return employees.map(e => {
      const assigned = shifts.filter(s => s.employeeId === e.id).length;
      const status = assigned === 0 ? 'available' : assigned >= 3 ? 'fully' : 'partial';
      return { ...e, status };
    }).filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  }, [employees, shifts, q]);

  return (
    <div>
      <input aria-label="Search team" value={q} onChange={e=> setQ(e.target.value)} placeholder="Search..." className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 mb-3" />
      <ul className="space-y-2">
        {statuses.map(e => (
          <li key={e.id} className="flex items-center justify-between rounded-lg bg-zinc-900/60 border border-zinc-700 p-2">
            <div>
              <div className="text-zinc-100">{e.name}</div>
              <div className="text-zinc-400 text-xs">{e.department} • {e.role}</div>
            </div>
            <div className="text-sm">
              {e.status === 'available' && <span className="text-emerald-400">✅ Available</span>}
              {e.status === 'partial' && <span className="text-amber-400">🟡 Partially Booked</span>}
              {e.status === 'fully' && <span className="text-rose-400">🔴 Fully Booked</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
