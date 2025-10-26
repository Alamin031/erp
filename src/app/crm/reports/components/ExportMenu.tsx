"use client";

import { useRef, useState } from "react";
import { MoreHorizontal, FileText, Download, Share2 } from "lucide-react";
import { useReports } from "@/store/useReports";

export function ExportMenu() {
  const { exportToCSV, exportToPDF } = useReports();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCSV = () => {
    const csv = exportToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-reports-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setOpen(false);
  };

  const handlePDF = () => {
    exportToPDF();
    setOpen(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setOpen(false);
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--foreground)",
          cursor: "pointer",
        }}
      >
        <MoreHorizontal size={16} />
        Export
      </button>
      {open && (
        <div role="menu" style={{ position: "absolute", right: 0, marginTop: 8, minWidth: 180, border: "1px solid var(--border)", background: "var(--card-bg)", borderRadius: 8, boxShadow: "var(--card-shadow)", overflow: "hidden", zIndex: 20 }}>
          <button role="menuitem" onClick={handleCSV} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "10px 12px", background: "transparent", border: 0, color: "var(--foreground)", cursor: "pointer" }}>
            <Download size={16} /> Export CSV
          </button>
          <button role="menuitem" onClick={handlePDF} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "10px 12px", background: "transparent", border: 0, color: "var(--foreground)", cursor: "pointer" }}>
            <FileText size={16} /> Export PDF
          </button>
          <button role="menuitem" onClick={handleShare} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "10px 12px", background: "transparent", border: 0, color: "var(--foreground)", cursor: "pointer" }}>
            <Share2 size={16} /> Share Report
          </button>
        </div>
      )}
    </div>
  );
}
