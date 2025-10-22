"use client";

import { useMemo, useState } from "react";
import { Equipment } from "@/types/equipment";
import { useEquipment } from "@/store/useEquipment";
import { useToast } from "@/components/toast";

interface Props {
  items: Equipment[];
  pagination: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onAdjust: (id: string) => void;
  onLinkWO: (id: string) => void;
}

type SortField = "quantity" | "lastMaintenanceAt" | "purchaseDate";
interface SortState { field: SortField; direction: "asc" | "desc" }

export function EquipmentTable({ items, pagination, onPaginationChange, onView, onEdit, onAdjust, onLinkWO }: Props) {
  const { deleteEquipment } = useEquipment();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "quantity", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a,b)=>{
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      if (sort.field === "quantity") {
        const av = a.quantity; const bv = b.quantity;
        return sort.direction === "asc" ? av - bv : bv - av;
      }
      const ad = aVal ? new Date(aVal as string).getTime() : 0;
      const bd = bVal ? new Date(bVal as string).getTime() : 0;
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
    const rows = items.filter(i => ids.includes(i.id)).map(i => [i.id, i.name, i.category, i.location||"", i.quantity.toString(), i.status, i.assignedTo||"", i.lastMaintenanceAt||"" ]);
    const csv = ["ID,Name,Category,Location,Quantity,Status,Assigned To,Last Maintenance", ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `equipment-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this equipment?")) {
      deleteEquipment(id);
      showToast("Equipment deleted", "success");
      setSelected(prev => { const s=new Set(prev); s.delete(id); return s; });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container border rounded-lg">
        <table className="reservations-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" checked={selected.size>0 && selected.size===pageItems.length} onChange={toggleAll} /></th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>
                <button className="underline-offset-2 hover:underline" onClick={() => setSort(s=>({ field: "quantity", direction: s.field==="quantity" && s.direction==="asc"?"desc":"asc" }))}>Quantity {sort.field==="quantity"?(sort.direction==="asc"?"▲":"▼"):""}</button>
              </th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>
                <button className="underline-offset-2 hover:underline" onClick={() => setSort(s=>({ field: "lastMaintenanceAt", direction: s.field==="lastMaintenanceAt" && s.direction==="asc"?"desc":"asc" }))}>Last Maintenance {sort.field==="lastMaintenanceAt"?(sort.direction==="asc"?"▲":"▼"):""}</button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length===0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-secondary">No equipment</td></tr>
            ) : pageItems.map(item => (
              <tr key={item.id}>
                <td><input type="checkbox" checked={selected.has(item.id)} onChange={() => setSelected(prev=>{const s=new Set(prev); s.has(item.id)?s.delete(item.id):s.add(item.id); return s;})} /></td>
                <td>{item.id}</td>
                <td className="font-medium">{item.name}</td>
                <td>{item.category}</td>
                <td>{item.location || "—"}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
                <td>{item.assignedTo || "—"}</td>
                <td className="text-xs text-secondary">{item.lastMaintenanceAt ? new Date(item.lastMaintenanceAt).toLocaleString() : "—"}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="View" onClick={()=>onView(item.id)}>👁️</button>
                    <button className="action-btn" title="Edit" onClick={()=>onEdit(item.id)}>✎</button>
                    <button className="action-btn" title="Adjust" onClick={()=>onAdjust(item.id)}>±</button>
                    <button className="action-btn" title="Link Work Order" onClick={()=>onLinkWO(item.id)}>🔗</button>
                    <button className="action-btn action-btn-danger" title="Delete" onClick={()=>confirmDelete(item.id)}>🗑️</button>
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
