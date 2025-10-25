"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useReports } from "@/store/useReports";
import { useToast } from "@/components/toast";
import { KPIStatsCards } from "./components/KPIStatsCards";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { SalesPerformanceChart } from "./components/SalesPerformanceChart";
import { PipelineFunnelChart } from "./components/PipelineFunnelChart";
import { ForecastChart } from "./components/ForecastChart";
import { AgentPerformanceChart } from "./components/AgentPerformanceChart";
import { ReportsTable } from "./components/ReportsTable";
import { ExportButtons } from "./components/ExportButtons";
import { EmptyState } from "./components/EmptyState";
import { ToastContainer } from "@/components/toast";

export function ReportsPageClient() {
  const {
    salesData,
    pipelineData,
    forecastData,
    agentData,
    kpiData,
    isLoading,
    fetchReportData,
    resetFilters,
  } = useReports();
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const hasData = salesData.length > 0 && pipelineData.length > 0;

  return (
    <div className="dashboard-container" style={{ overflow: "hidden" }}>
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <BarChart3 size={28} style={{ color: "var(--primary)" }} />
              <h2 className="dashboard-page-title">Reports</h2>
            </div>
            <p className="dashboard-subtitle">
              Generate reports on sales performance, pipeline, and forecasts
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" style={{ overflow: "hidden" }}>
          {/* KPI Stats */}
          <KPIStatsCards kpiData={kpiData} />

          {/* Filter Bar */}
          <ReportFilterBar />

          {isLoading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
              <p>Loading report data...</p>
            </div>
          ) : !hasData ? (
            <EmptyState onClearFilters={resetFilters} />
          ) : (
            <>
              {/* Charts Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                  gap: 24,
                  marginBottom: 24,
                }}
              >
                <SalesPerformanceChart data={salesData} />
                <PipelineFunnelChart data={pipelineData} />
                <ForecastChart data={forecastData} />
                <AgentPerformanceChart data={agentData} />
              </div>

              {/* Reports Table */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>
                  Agent Performance Summary
                </h3>
                <ReportsTable data={agentData} />
              </div>

              {/* Export Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--secondary)" }}>
                  Export Report
                </h3>
                <ExportButtons />
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
