"use client";

import { useMemo, useState } from "react";
import { Bill } from "@/types/bills";
import { Eye, Edit, Trash2, CheckCircle } from "lucide-react";

export interface BillsTableProps {
  bills: Bill[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  onView?: (bill: Bill) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
}

type SortKey = "billNumber" | "vendorName" | "billDate" | "amount" | "dueDate" | "status";

type SortState = { key: SortKey; dir: "asc" | "desc" };

export function BillsTable({
  bills,
  selectable = false,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
}: BillsTableProps) {
  const [sort, setSort] = useState<SortState>({ key: "dueDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sorted = useMemo(() => {
    const data = [...bills];
    data.sort((a, b) => {
      let va: any = a[sort.key as keyof Bill];
      let vb: any = b[sort.key as keyof Bill];
      if (sort.key === "billDate" || sort.key === "dueDate") {
        va = new Date(String(va)).getTime();
        vb = new Date(String(vb)).getTime();
      }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [bills, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return { color: "#0f766e", bg: "#0f766e20" };
      case "Pending":
        return { color: "#a16207", bg: "#a1620720" };
      case "Overdue":
        return { color: "#b91c1c", bg: "#b91c1c20" };
      case "Partial":
        return { color: "#1d4ed8", bg: "#1d4ed820" };
      default:
        return { color: "var(--secondary)", bg: "transparent" };
    }
  };

  const allSelected = selectable && selectedIds && bills.length > 0 && bills.every((b) => selectedIds.has(b.id));

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              {selectable && (
                <th style={{ padding: "12px 8px", width: 36, textAlign: "center" }}>
                  <input type="checkbox" checked={!!allSelected} onChange={(e) => onSelectAll?.(e.target.checked)} />
                </th>
              )}
              {([
                ["billNumber", "Bill ID"],
                ["vendorName", "Vendor"],
                ["billDate", "Date"],
                ["amount", "Amount"],
                ["dueDate", "Due Date"],
                ["status", "Status"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--secondary)", cursor: "pointer", whiteSpace: "nowrap" }}
                  title={`Sort by ${label}`}
                >
                  {label} {sort.key === key ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--secondary)", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((bill) => {
              const dueSoon = bill.status !== "Paid" && new Date(bill.dueDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
              const sc = statusColor(bill.status);
              return (
                <tr key={bill.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  {selectable && (
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      <input type="checkbox" checked={selectedIds?.has(bill.id)} onChange={() => onToggleSelect?.(bill.id)} />
                    </td>
                  )}
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--primary)" }}>{bill.billNumber}</td>
                  <td style={{ padding: "12px 16px" }}>{bill.vendorName}</td>
                  <td style={{ padding: "12px 16px" }}>{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>${bill.amount.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {new Date(bill.dueDate).toLocaleDateString()}
                      {dueSoon && bill.status !== "Paid" && (
                        <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 999, background: "#fecaca", color: "#7f1d1d" }}>Due soon</span>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, color: sc.color, background: sc.bg, fontWeight: 700, fontSize: 12 }}>{bill.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button title="View" onClick={() => onView?.(bill)} className="action-btn" style={{ border: "1px solid var(--border)", padding: "6px 8px", borderRadius: 6 }}> <Eye size={16} /> </button>
                      <button title="Edit" onClick={() => onEdit?.(bill)} className="action-btn" style={{ border: "1px solid var(--border)", padding: "6px 8px", borderRadius: 6 }}> <Edit size={16} /> </button>
                      <button title="Delete" onClick={() => onDelete?.(bill)} className="action-btn" style={{ border: "1px solid var(--border)", padding: "6px 8px", borderRadius: 6, color: "#b91c1c" }}> <Trash2 size={16} /> </button>
                      {bill.status !== "Paid" && (
                        <button title="Mark as Paid" onClick={() => onEdit?.({ ...bill, status: "Paid" } as Bill)} className="action-btn" style={{ border: "1px solid var(--border)", padding: "6px 8px", borderRadius: 6, color: "#0f766e" }}> <CheckCircle size={16} /> </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, color: "var(--secondary)" }}>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "transparent", color: page === 1 ? "var(--secondary)" : "var(--primary)" }}>Prev</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "transparent", color: page === totalPages ? "var(--secondary)" : "var(--primary)" }}>Next</button>
          <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }} style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
