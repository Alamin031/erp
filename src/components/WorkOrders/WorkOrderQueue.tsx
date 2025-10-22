"use client";

import { useMemo } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";
import { WorkOrder } from "@/types/workorder";

function WorkOrderCard({ item, onAssign, onStart, onComplete }: { item: WorkOrder; onAssign: (id: string)=>void; onStart:(id:string)=>void; onComplete:(id:string)=>void }) {
  const priorityColors: Record<string, string> = { Low: "bg-green-100", Medium: "bg-yellow-100", High: "bg-orange-100", Critical: "bg-red-100" };
  return (
    <div className="p-3 rounded-lg border border-border bg-card-bg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm truncate">{item.title}</div>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[item.priority]}`}>{item.priority}</span>
      </div>
      <div className="text-xs text-secondary truncate">{item.assetName || item.assetType || "—"}</div>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-secondary btn-sm" title="Assign" onClick={()=>onAssign(item.id)}>👤</button>
        {item.status !== "In Progress" && item.status !== "Completed" && (
          <button className="btn btn-secondary btn-sm" title="Start" onClick={()=>onStart(item.id)}>▶</button>
        )}
        {item.status !== "Completed" && (
          <button className="btn btn-primary btn-sm" title="Complete" onClick={()=>onComplete(item.id)}>✓</button>
        )}
      </div>
    </div>
  );
}

export function WorkOrderQueue({ onAssign, onStart, onComplete }: { onAssign: (id:string)=>void; onStart:(id:string)=>void; onComplete:(id:string)=>void }) {
  const { workOrders } = useWorkOrders();
  const ordered = useMemo(() => {
    const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...workOrders]
      .filter(w => w.status !== "Completed")
      .sort((a,b)=> order[a.priority]-order[b.priority]);
  }, [workOrders]);

  return (
    <div className="flex flex-col gap-2">
      {ordered.length === 0 ? (
        <div className="text-center text-secondary py-4 text-sm">No work orders</div>
      ) : (
        ordered.map(w => (
          <WorkOrderCard key={w.id} item={w} onAssign={onAssign} onStart={onStart} onComplete={onComplete} />
        ))
      )}
    </div>
  );
}
