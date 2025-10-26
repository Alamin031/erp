"use client";

import { useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { useReports } from "@/store/useReports";
import { useToast, ToastContainer } from "@/components/toast";
import { KPIStatsCards } from "./components/KPIStatsCards";
import { ReportFilters } from "./components/ReportFilters";
import { SalesPerformanceChart } from "./components/SalesPerformanceChart";
import { PipelineStageChart } from "./components/PipelineStageChart";
import { ForecastChart } from "./components/ForecastChart";
import { ActivitySummaryChart } from "./components/ActivitySummaryChart";
import { ReportsTable } from "./components/ReportsTable";
import { ExportMenu } from "./components/ExportMenu";
import { EmptyState } from "./components/EmptyState";

export function ReportsPageClient() {
  const {
    salesData,
    pipelineData,
    forecastData,
    activitySummary,
    kpiData,
    isLoading,
    fetchReports,
    resetFilters,
  } = useReports();
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const hasData = salesData.length > 0 && pipelineData.length > 0;

  return (
    <div className="dashboard-container" style={{ overflow: "hidden" }}>
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <BarChart3 size={28} style={{ color: "var(--primary)" }} />
              <h2 className="dashboard-page-title">CRM Reports</h2>
            </div>
            <p className="dashboard-subtitle">Generate reports on sales performance, pipeline, and forecasts</p>
          </div>
          <ExportMenu />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" style={{ overflow: "hidden" }}>
          <ReportFilters />
          <KPIStatsCards kpiData={kpiData} />

          {isLoading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
              <p>Loading report data...</p>
            </div>
          ) : !hasData ? (
            <EmptyState onClearFilters={resetFilters} />
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24, marginBottom: 24 }}>
                <SalesPerformanceChart data={salesData} />
                <PipelineStageChart data={pipelineData} />
                <ForecastChart data={forecastData} />
                <ActivitySummaryChart data={activitySummary} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Reports</h3>
                <ReportsTable />
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
