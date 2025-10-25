"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SalesDataPoint {
  month: string;
  sales: number;
  target: number;
}

export interface PipelineStage {
  name: string;
  count: number;
  percentage: number;
}

export interface ForecastDataPoint {
  month: string;
  predicted: number;
  actual: number;
  variance: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  dealsClosedThisMonth: number;
  revenue: number;
  avgDealSize: number;
  conversionRate: number;
  forecastAccuracy: number;
}

export interface KPIData {
  totalSales: number;
  closedDeals: number;
  conversionRate: number;
  forecastAccuracy: number;
  topAgent: string;
}

export interface CRMReportFilters {
  dateFrom: string;
  dateTo: string;
  agent: string;
  region: string;
  reportType: "sales" | "pipeline" | "forecast" | "all";
}

interface ReportsState {
  salesData: SalesDataPoint[];
  pipelineData: PipelineStage[];
  forecastData: ForecastDataPoint[];
  agentData: AgentPerformance[];
  kpiData: KPIData;
  filters: CRMReportFilters;
  isLoading: boolean;

  setFilters: (filters: Partial<CRMReportFilters>) => void;
  resetFilters: () => void;
  fetchReportData: () => Promise<void>;
  calculateKPIs: () => void;
  exportToCSV: () => string;
  exportToPDF: () => void;
}

const defaultFilters: CRMReportFilters = {
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  dateTo: new Date().toISOString().split("T")[0],
  agent: "",
  region: "",
  reportType: "all",
};

const defaultKPIData: KPIData = {
  totalSales: 0,
  closedDeals: 0,
  conversionRate: 0,
  forecastAccuracy: 0,
  topAgent: "",
};

export const useReports = create<ReportsState>()(
  persist(
    (set, get) => ({
      salesData: [],
      pipelineData: [],
      forecastData: [],
      agentData: [],
      kpiData: defaultKPIData,
      filters: defaultFilters,
      isLoading: false,

      setFilters: (filters: Partial<CRMReportFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      fetchReportData: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch("/data/crmReports.json");
          const data = await response.json();
          set({
            salesData: data.salesData || [],
            pipelineData: data.pipelineData || [],
            forecastData: data.forecastData || [],
            agentData: data.agentData || [],
            isLoading: false,
          });
          get().calculateKPIs();
        } catch (error) {
          console.error("Failed to fetch reports:", error);
          set({ isLoading: false });
        }
      },

      calculateKPIs: () => {
        const { salesData, pipelineData, agentData, forecastData } = get();

        const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
        const closedDeals = pipelineData[pipelineData.length - 1]?.count || 0;

        const totalLeads = pipelineData.reduce((sum, s) => sum + s.count, 0);
        const conversionRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

        const forecastAccuracy = forecastData.length > 0
          ? 100 - (forecastData.reduce((sum, d) => sum + Math.abs(d.variance), 0) / forecastData.length)
          : 0;

        const topAgent = agentData.length > 0
          ? agentData.reduce((top, agent) =>
              agent.revenue > top.revenue ? agent : top
            ).name
          : "";

        set({
          kpiData: {
            totalSales: Math.round(totalSales),
            closedDeals,
            conversionRate: Math.round(conversionRate * 10) / 10,
            forecastAccuracy: Math.max(0, Math.round(forecastAccuracy)),
            topAgent,
          },
        });
      },

      exportToCSV: () => {
        const { agentData } = get();
        const headers = ["Agent", "Deals Closed", "Revenue", "Conversion Rate %", "Forecast Accuracy %"];
        const rows = agentData.map((agent) => [
          agent.name,
          agent.dealsClosedThisMonth.toString(),
          `$${agent.revenue.toLocaleString()}`,
          `${agent.conversionRate}%`,
          `${agent.forecastAccuracy}%`,
        ]);

        return [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");
      },

      exportToPDF: () => {
        alert("PDF export would be implemented with a library like jsPDF or pdfkit");
      },
    }),
    {
      name: "crm-reports-store",
    }
  )
);
