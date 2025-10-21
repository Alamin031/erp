"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportFilters } from "@/store/useReports";

interface FilterPanelProps {
  filters: ReportFilters;
  onFilterChange: (filters: ReportFilters) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ReportFilters = {
      dateFrom: "",
      dateTo: "",
      reportType: "All",
      department: "",
      branch: "",
      paymentMethod: "",
    };
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== "All"
  );

  return (
    <motion.div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          background: "transparent",
          border: "none",
          borderBottom: isOpen ? "1px solid var(--border)" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--foreground)",
        }}
      >
        <span>🔍 Filters {hasActiveFilters && `(${Object.values(filters).filter((v) => v !== "" && v !== "All").length})`}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Report Type</label>
                  <select
                    className="form-input"
                    value={filters.reportType}
                    onChange={(e) => handleFilterChange("reportType", e.target.value)}
                  >
                    <option value="All">All Reports</option>
                    <option value="Revenue">Revenue Only</option>
                    <option value="Expense">Expense Only</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Branch</label>
                  <select
                    className="form-input"
                    value={filters.branch}
                    onChange={(e) => handleFilterChange("branch", e.target.value)}
                  >
                    <option value="">All Branches</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-input"
                    value={filters.paymentMethod}
                    onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  >
                    <option value="">All Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleReset}
                  disabled={!hasActiveFilters}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: hasActiveFilters ? "var(--primary)" : "var(--secondary)",
                    background: "transparent",
                    border: `1px solid ${hasActiveFilters ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "4px",
                    cursor: hasActiveFilters ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
