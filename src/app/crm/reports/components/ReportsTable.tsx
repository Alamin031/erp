"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Eye, Trash2, Download, FileText } from "lucide-react";
import { useReports, Report } from "@/store/useReports";

type SortField = "date" | "type" | "name" | "createdBy";
type SortOrder = "asc" | "desc";

export function ReportsTable() {
  const { filterReports, selectReport, selectedReport, exportReport } = useReports();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [open, setOpen] = useState(false);

  const data = filterReports();
  const itemsPerPage = 6;

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const av: any = a[sortField] ?? "";
      const bv: any = b[sortField] ?? "";
      if (sortField === "date") {
        const at = a.date ? new Date(a.date).getTime() : 0;
        const bt = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === "asc" ? at - bt : bt - at;
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return 0;
    });
    return sorted;
  }, [data, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = sortedData.slice(startIdx, startIdx + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("desc"); }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown size={14} style={{ opacity: sortField === field ? 1 : 0.3, color: sortField === field ? "var(--primary)" : "var(--secondary)" }} />
  );

  const openDetails = (r: Report) => { selectReport(r.id); setOpen(true); };
  const closeDetails = () => setOpen(false);

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No reports available</p>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
              <th onClick={() => handleSort("name")} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>Report Name <SortIcon field="name" /></div>
              </th>
              <th onClick={() => handleSort("type")} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>Type <SortIcon field="type" /></div>
              </th>
              <th onClick={() => handleSort("createdBy")} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>Created By <SortIcon field="createdBy" /></div>
              </th>
              <th onClick={() => handleSort("date")} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>Date <SortIcon field="date" /></div>
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--foreground)" }}>Filters</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--foreground)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <motion.tr key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{r.name || r.type || "Report"}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--secondary)" }}>{r.type || "-"}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--secondary)" }}>{r.createdBy || "System"}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--secondary)" }}>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--secondary)" }}>
                  {r.filters ? JSON.stringify(r.filters) : "—"}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => openDetails(r)} title="View" style={{ border: "1px solid var(--border)", background: "transparent", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}><Eye size={14} /></button>
                    <button onClick={() => exportReport(r.id, "csv")} title="CSV" style={{ border: "1px solid var(--border)", background: "transparent", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}><Download size={14} /></button>
                    <button onClick={() => exportReport(r.id, "pdf")} title="PDF" style={{ border: "1px solid var(--border)", background: "transparent", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}><FileText size={14} /></button>
                    <button onClick={() => alert("Delete confirmed") } title="Delete" style={{ border: "1px solid var(--border)", background: "transparent", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--secondary)" }}>Page {currentPage} of {totalPages}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      </div>

      <AnimatePresence>
        {open && selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={closeDetails}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ width: "min(600px, 92vw)", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Report Details</h3>
              <pre style={{ fontSize: 12, background: "var(--background)", padding: 12, borderRadius: 8, overflow: "auto" }}>{JSON.stringify(selectedReport, null, 2)}</pre>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button onClick={closeDetails} style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
