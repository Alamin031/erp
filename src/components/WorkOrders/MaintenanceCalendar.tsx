"use client";

import { useMemo } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";

export function MaintenanceCalendar() {
  const { workOrders } = useWorkOrders();
  const byDate = useMemo(()=>{
    const map = new Map<string, number>();
    workOrders.forEach(w => {
      if (!w.dueAt) return;
      const d = new Date(w.dueAt).toISOString().split('T')[0];
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries()).slice(0, 14);
  }, [workOrders]);

  return (
    <div className="dashboard-section">
      <h3 className="section-title">Maintenance Calendar</h3>
      <div className="flex flex-col gap-2 text-sm">
        {byDate.length===0 ? <div className="text-secondary">No scheduled SLAs</div> : byDate.map(([d, c]) => (
          <div key={d} className="flex justify-between"><span>{d}</span><span className="font-semibold">{c} due</span></div>
        ))}
      </div>
    </div>
  );
}
