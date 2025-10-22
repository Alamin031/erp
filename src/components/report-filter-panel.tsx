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

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== "All"
  ).length;
  const hasActiveFilters = activeCount > 0;

  const styles: Record<string, React.CSSProperties> = {
    wrapper: {
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 24,
    },
    headerBtn: {
      width: "100%",
      padding: 14,
      background: "transparent",
      border: "none",
      borderBottom: isOpen ? "1px solid var(--border)" : "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--foreground)",
    },
    headerLeft: { display: "flex", gap: 8, alignItems: "center" },
    chevron: {
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.18s",
      fontSize: 12,
      color: "var(--secondary)",
    },
    content: { padding: 16 },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 16,
      alignItems: "end",
      marginBottom: 12,
    },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 13, color: "var(--secondary)" },
    input: {
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid var(--border)",
      background: "var(--input-bg, transparent)",
      color: "var(--foreground)",
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box",
    },
    actionsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      marginTop: 6,
    },
    leftActions: {},
    rightActions: { display: "flex", gap: 8 },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      background: "var(--background)",
      border: "1px solid var(--border)",
      fontSize: 13,
      color: "var(--secondary)",
    },
  };

  const resetBtn = (enabled = true): React.CSSProperties => ({
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: enabled ? "var(--primary)" : "var(--secondary)",
    background: "transparent",
    border: `1px solid ${enabled ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 6,
    cursor: enabled ? "pointer" : "not-allowed",
  });

  return (
    <motion.div style={styles.wrapper} layout>
      <button
        onClick={() => setIsOpen((s) => !s)}
        style={styles.headerBtn}
        aria-expanded={isOpen}
        aria-controls="report-filter-panel"
      >
        <div style={styles.headerLeft}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span>Filters</span>
          {hasActiveFilters && (
            <span style={{ color: "var(--primary)", fontWeight: 700 }}>
              ({activeCount})
            </span>
          )}
        </div>

        <div style={styles.chevron} aria-hidden>
          ▲
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="report-filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={styles.content}>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>From Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>To Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Report Type</label>
                  <select
                    style={styles.input}
                    value={filters.reportType}
                    onChange={(e) =>
                      handleFilterChange("reportType", e.target.value)
                    }
                  >
                    <option value="All">All Reports</option>
                    <option value="Revenue">Revenue Only</option>
                    <option value="Expense">Expense Only</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Branch</label>
                  <select
                    style={styles.input}
                    value={filters.branch}
                    onChange={(e) =>
                      handleFilterChange("branch", e.target.value)
                    }
                  >
                    <option value="">All Branches</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Payment Method</label>
                  <select
                    style={styles.input}
                    value={filters.paymentMethod}
                    onChange={(e) =>
                      handleFilterChange("paymentMethod", e.target.value)
                    }
                  >
                    <option value="">All Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Department</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="All Departments"
                    value={(filters as any).department || ""}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                  />
                </div>
              </div>

              <div style={styles.actionsRow}>
                <div style={styles.leftActions}>
                  <div style={styles.pill}>
                    <span style={{ fontSize: 12, color: "var(--secondary)" }}>
                      Active
                    </span>
                    <strong style={{ color: "var(--foreground)" }}>
                      {activeCount}
                    </strong>
                  </div>
                </div>

                  <button
                    onClick={handleReset}
                    disabled={!hasActiveFilters}
                    style={resetBtn(hasActiveFilters)}
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
