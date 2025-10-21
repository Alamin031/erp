"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BulkUploadResult } from "@/types/rates";
import { useToast } from "./toast";

interface BulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => Promise<BulkUploadResult>;
}

export function BulkUpload({ isOpen, onClose, onUpload }: BulkUploadProps) {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type) && !file.name.endsWith(".csv")) {
        showToast("Please upload a CSV or Excel file", "error");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please select a file", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await onUpload?.(selectedFile);
      if (result) {
        setUploadResult(result);
        showToast(`Processed ${result.totalRows} rows: ${result.successCount} successful`, "success");
      }
    } catch (error) {
      showToast("Error uploading file", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `Rate Code,Room Type,Rate Type,Base Price,Effective From,Effective To,Channels,Status,Notes
STD-BASE,Standard,Base,99.00,2025-01-01,2025-12-31,All,Active,Standard room base rate
DLX-BASE,Deluxe,Base,149.00,2025-01-01,2025-12-31,All,Active,Deluxe room base rate
`;
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rate_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Template downloaded", "success");
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }} />
      <motion.div
        className="modal"
        style={{ zIndex: 1001 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>Bulk Upload Rates</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          {!uploadResult ? (
            <>
              <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "6px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                  Instructions
                </h4>
                <ul style={{ margin: "8px 0", paddingLeft: "16px", fontSize: "12px", color: "var(--secondary)" }}>
                  <li>Upload a CSV or Excel file</li>
                  <li>Columns required: Rate Code, Room Type, Rate Type, Base Price</li>
                  <li>Download the template to see expected format</li>
                  <li>Verify data in dry-run before confirming</li>
                </ul>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <button
                  onClick={handleDownloadTemplate}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--primary)",
                    background: "transparent",
                    border: "1px solid var(--primary)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                >
                  ↓ Download Template
                </button>

                <div
                  style={{
                    padding: "32px",
                    border: "2px dashed var(--border)",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--background)",
                    transition: "all 0.2s",
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "var(--primary)08";
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--background)";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--background)";
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                  }}
                >
                  <div style={{ marginBottom: "12px", fontSize: "32px" }}>📁</div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                    Drop your file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    style={{
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "var(--primary)",
                      fontWeight: "600",
                    }}
                  >
                    Click to select
                  </label>
                </div>

                {selectedFile && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--secondary)" }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        color: "#dc3545",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Upload & Review"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  Upload Summary
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ padding: "12px", background: "var(--background)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>
                      Total Rows
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
                      {uploadResult.totalRows}
                    </div>
                  </div>

                  <div style={{ padding: "12px", background: "#dcfce7", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#166534", marginBottom: "4px" }}>
                      Successful
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#166534" }}>
                      {uploadResult.successCount}
                    </div>
                  </div>

                  {uploadResult.errorCount > 0 && (
                    <div style={{ padding: "12px", background: "#fee2e2", borderRadius: "6px" }}>
                      <div style={{ fontSize: "11px", color: "#991b1b", marginBottom: "4px" }}>
                        Errors
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#991b1b" }}>
                        {uploadResult.errorCount}
                      </div>
                    </div>
                  )}

                  {uploadResult.warnings && uploadResult.warnings.length > 0 && (
                    <div style={{ padding: "12px", background: "#fef3c7", borderRadius: "6px" }}>
                      <div style={{ fontSize: "11px", color: "#92400e", marginBottom: "4px" }}>
                        Warnings
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#92400e" }}>
                        {uploadResult.warnings.length}
                      </div>
                    </div>
                  )}
                </div>

                {uploadResult.errors.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <h5 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "#991b1b" }}>
                      Errors:
                    </h5>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {uploadResult.errors.slice(0, 10).map((error, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "8px",
                            background: "#fee2e2",
                            borderRadius: "4px",
                            marginBottom: "4px",
                            fontSize: "11px",
                          }}
                        >
                          <strong>Row {error.rowNumber}:</strong> {error.message}
                        </div>
                      ))}
                      {uploadResult.errors.length > 10 && (
                        <div style={{ fontSize: "11px", color: "var(--secondary)", padding: "8px" }}>
                          ... and {uploadResult.errors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setUploadResult(null);
                    setSelectedFile(null);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                  disabled={uploadResult.errorCount > 0}
                >
                  {uploadResult.errorCount > 0 ? "Fix Errors First" : "Complete Upload"}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
