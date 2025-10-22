"use client";

import { useWorkOrders } from "@/store/useWorkOrders";

export function WorkOrderActivityLog() {
  const { workOrders } = useWorkOrders();
  const events = workOrders.flatMap(w => w.logs.map(l => ({...l, wo: w}))).sort((a,b)=> new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12);

  return (
    <div className="dashboard-section">
      <h3 className="section-title">Recent Activity</h3>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {events.length===0 ? <div className="text-secondary text-sm">No activity</div> : events.map(e => (
          <div key={e.id} className="activity-item">
            <div className="flex justify-between">
              <div className="text-sm"><span className="font-medium">{e.wo.id}</span> — {e.message}</div>
              <div className="text-xs text-secondary">{new Date(e.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
