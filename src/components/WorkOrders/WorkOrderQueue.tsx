"use client";

import { useMemo } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";
import { WorkOrder } from "@/types/workorder";

function WorkOrderCard({ item, onAssign, onStart, onComplete }: { item: WorkOrder; onAssign: (id: string)=>void; onStart:(id:string)=>void; onComplete:(id:string)=>void }) {
  const priorityColors: Record<string, { bg: string; color: string }> = {
    Low: { bg: "rgba(40, 167, 69, 0.1)", color: "var(--success)" },
    Medium: { bg: "rgba(255, 193, 7, 0.1)", color: "var(--warning)" },
    High: { bg: "rgba(255, 165, 0, 0.1)", color: "#ff8c00" },
    Critical: { bg: "rgba(220, 53, 69, 0.1)", color: "var(--danger)" }
  };
  const priorityStyle = priorityColors[item.priority] || priorityColors.Medium;
  return (
    <div className="p-3 rounded-lg border border-border bg-card-bg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm truncate">{item.title}</div>
        <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "4px", background: priorityStyle.bg, color: priorityStyle.color, fontWeight: "600" }}>{item.priority}</span>
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
