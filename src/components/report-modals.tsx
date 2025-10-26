"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Report } from "@/store/useReports";
import { useToast } from "./toast";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export function ExportModal({ isOpen, onClose, report }: ExportModalProps) {
  const { showToast } = useToast();
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "json">("csv");
  const [filename, setFilename] = useState(report ? `${report.id}-report` : "report");

  const handleExport = () => {
    if (!report) return;

    let content = "";
    let mimeType = "text/plain";
    const filenameWithExt = `${filename}.${exportFormat}`;

    if (exportFormat === "json") {
      content = JSON.stringify(report, null, 2);
      mimeType = "application/json";
    } else if (exportFormat === "csv") {
      content = `Report ID,Date,Type,Category,Amount,Created By,Branch,Payment Method\n${report.id},${report.date},${report.type},${report.category},${report.amount},"${report.createdBy}","${report.branch}","${report.paymentMethod}"`;
      mimeType = "text/csv";
    } else if (exportFormat === "pdf") {
      content = `Report: ${report.id}\nDate: ${report.date}\nType: ${report.type}\nCategory: ${report.category}\nAmount: $${report.amount}\nCreated By: ${report.createdBy}\nBranch: ${report.branch}\nPayment Method: ${report.paymentMethod}`;
      mimeType = "text/plain";
    }

    const element = document.createElement("a");
    element.setAttribute("href", `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute("download", filenameWithExt);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast(`Report exported as ${exportFormat.toUpperCase()}`, "success");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
              Export Report
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Format</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {(["csv", "json", "pdf"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: exportFormat === format ? "white" : "var(--foreground)",
                      background: exportFormat === format ? "var(--primary)" : "var(--background)",
                      border: `1px solid ${exportFormat === format ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label className="form-label">Filename</label>
              <input
                type="text"
                className="form-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="report"
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--foreground)",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export function ReportDetailsModal({ isOpen, onClose, report }: ReportDetailsModalProps) {
  const { showToast } = useToast();

  const handleExportPDF = () => {
    if (!report) return;

    const content = `
Report: ${report.id}
Date: ${report.date}
Type: ${report.type}
Category: ${report.category}
Amount: $${report.amount}
Created By: ${report.createdBy}
Branch: ${report.branch}
Payment Method: ${report.paymentMethod}
Description: ${report.description || "N/A"}

Details:
${report.details?.map((d: { name: string; amount: number }) => `- ${d.name}: $${d.amount.toLocaleString()}`)?.join("\n") || "No details"}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute("download", `${report.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast("Report exported as PDF", "success");
  };

  return (
    <AnimatePresence>
      {isOpen && report && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              margin: "40px auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  {report.id}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--secondary)" }}>
                  {report.category}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--secondary)",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Type
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: report.type === "Revenue" ? "#28a745" : "#dc3545",
                  }}
                >
                  {report.type}
                </p>
              </div>
              <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Amount
                </p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  {report.amount != null ? `$${report.amount.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Date
                </p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  {report.date ? new Date(report.date).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Created By
                </p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  {report.createdBy}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                Branch & Payment
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ fontSize: "13px", color: "var(--secondary)" }}>
                  <span style={{ color: "var(--foreground)", fontWeight: "600" }}>Branch:</span> {report.branch}
                </div>
                <div style={{ fontSize: "13px", color: "var(--secondary)" }}>
                  <span style={{ color: "var(--foreground)", fontWeight: "600" }}>Method:</span> {report.paymentMethod}
                </div>
              </div>
            </div>

            {report.description && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  Description
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--secondary)", lineHeight: "1.5" }}>
                  {report.description}
                </p>
              </div>
            )}

            {report.details && report.details.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  Breakdown
                </p>
                <div style={{ background: "var(--background)", borderRadius: "4px", overflow: "hidden" }}>
                  {report.details.map((detail: { name: string; amount: number }, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderBottom: index < report.details!.length - 1 ? "1px solid var(--border)" : "none",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "var(--secondary)" }}>{detail.name}</span>
                      <span style={{ color: "var(--foreground)", fontWeight: "600" }}>
                        ${detail.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--foreground)",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={handleExportPDF}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📥 Download PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
