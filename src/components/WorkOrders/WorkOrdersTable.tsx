"use client";

import { useMemo, useState } from "react";
import { WorkOrder } from "@/types/workorder";
import { useWorkOrders } from "@/store/useWorkOrders";
import { useToast } from "@/components/toast";

type SortField = "dueAt" | "priority" | "createdAt";
interface SortState { field: SortField; direction: "asc" | "desc" }

interface Props {
  items: WorkOrder[];
  pagination: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (id: string) => void;
  onAssign: (id: string) => void;
}

const priorityOrder: Record<string, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 };

export function WorkOrdersTable({ items, pagination, onPaginationChange, onView, onAssign }: Props) {
  const { showToast } = useToast();
  const { delete: _del } = { delete: (id: string) => {} } as any; // not used now
  const { startWorkOrder, pauseWorkOrder, completeWorkOrder } = useWorkOrders();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "dueAt", direction: "asc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      if (sort.field === "priority") {
        const pa = priorityOrder[a.priority];
        const pb = priorityOrder[b.priority];
        return sort.direction === "asc" ? pa - pb : pb - pa;
      }
      const av = a[sort.field];
      const bv = b[sort.field];
      const ad = av ? new Date(av).getTime() : 0;
      const bd = bv ? new Date(bv).getTime() : 0;
      return sort.direction === "asc" ? ad - bd : bd - ad;
    });
    return copy;
  }, [items, sort]);

  const totalPages = Math.ceil(sorted.length / pagination.pageSize) || 1;
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageItems = sorted.slice(start, start + pagination.pageSize);

  const toggleAll = () => {
    if (selected.size === pageItems.length) setSelected(new Set());
    else setSelected(new Set(pageItems.map(i => i.id)));
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = items.filter(i => ids.includes(i.id)).map(i => [i.id, i.title, i.assetName || "", i.priority, i.createdAt, i.assignedTechName || "", i.dueAt || "", i.status]);
    const csv = ["ID,Title,Asset,Priority,Requested At,Assigned To,SLA,Status", ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `workorders-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container border rounded-lg">
        <table className="reservations-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" checked={selected.size>0 && selected.size===pageItems.length} onChange={toggleAll} /></th>
              <th>ID</th>
              <th>Title</th>
              <th>Asset/Room</th>
              <th>
                <button className="underline-offset-2 hover:underline" onClick={() => setSort(s=>({ field: "priority", direction: s.field==="priority" && s.direction==="asc"?"desc":"asc" }))}>Priority {sort.field==="priority"?(sort.direction==="asc"?"▲":"▼"):""}</button>
              </th>
              <th>
                <button className="underline-offset-2 hover:underline" onClick={() => setSort(s=>({ field: "createdAt", direction: s.field==="createdAt" && s.direction==="asc"?"desc":"asc" }))}>Requested At {sort.field==="createdAt"?(sort.direction==="asc"?"▲":"▼"):""}</button>
              </th>
              <th>Assigned To</th>
              <th>
                <button className="underline-offset-2 hover:underline" onClick={() => setSort(s=>({ field: "dueAt", direction: s.field==="dueAt" && s.direction==="asc"?"desc":"asc" }))}>SLA {sort.field==="dueAt"?(sort.direction==="asc"?"▲":"▼"):""}</button>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length===0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-secondary">No work orders</td></tr>
            ) : pageItems.map(item => (
              <tr key={item.id}>
                <td><input type="checkbox" checked={selected.has(item.id)} onChange={() => setSelected(prev=>{const s=new Set(prev); s.has(item.id)?s.delete(item.id):s.add(item.id); return s;})} /></td>
                <td>{item.id}</td>
                <td className="font-medium">{item.title}</td>
                <td>{item.assetName || "—"}</td>
                <td>{item.priority}</td>
                <td className="text-xs text-secondary">{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.assignedTechName || "Unassigned"}</td>
                <td className="text-xs">{item.dueAt ? new Date(item.dueAt).toLocaleString() : "—"}</td>
                <td>{item.status}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="View" onClick={() => onView(item.id)}>👁️</button>
                    <button className="action-btn" title="Assign" onClick={() => onAssign(item.id)}>👤</button>
                    {item.status !== "In Progress" && item.status !== "Completed" && (
                      <button className="action-btn" title="Start" onClick={() => { startWorkOrder(item.id); showToast("Work order started", "success"); }}>▶</button>
                    )}
                    {item.status === "In Progress" && (
                      <button className="action-btn" title="Pause" onClick={() => { pauseWorkOrder(item.id); showToast("Work order paused", "info"); }}>⏸</button>
                    )}
                    {item.status !== "Completed" && (
                      <button className="action-btn" title="Complete" onClick={() => { completeWorkOrder(item.id); showToast("Work order completed", "success"); }}>✓</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" disabled={selected.size===0} onClick={exportCSV}>Export CSV</button>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" disabled={pagination.page===1} onClick={()=>onPaginationChange(Math.max(1,pagination.page-1), pagination.pageSize)}>← Prev</button>
          <button className="btn btn-secondary" disabled={start + pagination.pageSize >= sorted.length} onClick={()=>onPaginationChange(pagination.page+1, pagination.pageSize)}>Next →</button>
        </div>
      </div>
    </div>
  );
}
