"use client";

import { FileText, Printer, Download } from "lucide-react";
import { useReports } from "@/store/useReports";
import { useToast } from "@/components/toast";

export function ExportButtons() {
  const { exportToCSV, exportToPDF } = useReports();
  const { showToast } = useToast();

  const handleExportCSV = () => {
    try {
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
      showToast("Report exported as CSV", "success");
    } catch (error) {
      showToast("Failed to export CSV", "error");
    }
  };

  const handlePrint = () => {
    try {
      window.print();
      showToast("Print dialog opened", "success");
    } catch (error) {
      showToast("Failed to print", "error");
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF();
      showToast("PDF export initiated", "info");
    } catch (error) {
      showToast("Failed to export PDF", "error");
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button
        onClick={handleExportCSV}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          backgroundColor: "transparent",
          color: "var(--foreground)",
          fontWeight: 500,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        <Download size={16} />
        Export CSV
      </button>

      <button
        onClick={handleExportPDF}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          backgroundColor: "transparent",
          color: "var(--foreground)",
          fontWeight: 500,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        <FileText size={16} />
        Export PDF
      </button>

      <button
        onClick={handlePrint}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          backgroundColor: "transparent",
          color: "var(--foreground)",
          fontWeight: 5,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        <Printer size={16} />
        Print Report
      </button>
    </div>
  );
}
