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

// new shared Report type used by UI components (optional fields to match varied sources)
export interface Report {
  id: string;
  date?: string | number | Date;
  type?: string;
  amount?: number;
  target?: number;
  name?: string;
  count?: number;
  percentage?: number;
  source?: string;
  agent?: string;
  region?: string;
  createdBy?: string;
  [key: string]: any;
}

// exported filter type used by UI panel
export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  // use a flexible string here so component and store stay in sync; component uses "All"/"Revenue"/"Expense"
  reportType: string;
  department?: string;
  branch?: string;
  paymentMethod?: string;
  agent?: string; // legacy alias
  salesperson?: string; // preferred name in UI
  region?: string;
  dealStage?: string;
  companyType?: string;
}

// add alias for compatibility with imports expecting CRMReportFilters
export type CRMReportFilters = ReportFilters;

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

export interface ActivitySummary {
  type: string; // Calls, Emails, Meetings, Follow-ups
  count: number;
}

interface ReportsState {
  // existing data
  salesData: SalesDataPoint[];
  pipelineData: PipelineStage[];
  forecastData: ForecastDataPoint[];
  agentData: AgentPerformance[];
  activitySummary: ActivitySummary[];
  kpiData: KPIData;
  filters: ReportFilters;
  isLoading: boolean;

  // new fields expected by UI
  reports: Report[];
  selectedReport: Report | null;

  // actions
  setFilters: (filters: Partial<ReportFilters>) => void;
  resetFilters: () => void;
  fetchReportData: () => Promise<void>;
  fetchReports: () => Promise<void>;
  selectReport: (id: string) => void;
  filterReports: () => Report[];
  calculateKPIs: () => void;
  exportToCSV: () => string;
  exportToPDF: () => void;
  loadDemoData: () => Promise<void>;
  generateReport: (type: string) => Report;
  exportReport: (id: string, format: "csv" | "pdf") => void;
}

const defaultFilters: ReportFilters = {
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  dateTo: new Date().toISOString().split("T")[0],
  reportType: "All",
  agent: "",
  region: "",
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

      // added defaults for UI
      reports: [],
      selectedReport: null,

      setFilters: (filters: Partial<ReportFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      // low-level fetch used internally
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

      // high-level fetch used by UI components (keeps API used in page-client.tsx)
      fetchReports: async () => {
        // reuse existing CRM fetch; then build a simple reports array the UI expects
        await get().fetchReportData();

        const sales = (get().salesData || []).map((s) => ({
          id: `sales-${s.month}`,
          date: s.month,
          type: "Revenue",
          amount: s.sales,
          target: s.target,
          source: "sales",
        }));

        // treat forecast.actual as expense for basic compatibility; adjust as needed
        const expenses = (get().forecastData || []).map((f) => ({
          id: `forecast-${f.month}`,
          date: f.month,
          type: "Expense",
          amount: f.actual ?? 0,
          predicted: f.predicted,
          variance: f.variance,
          source: "forecast",
        }));

        // pipeline entries as generic reports
        const pipeline = (get().pipelineData || []).map((p, idx) => ({
          id: `pipeline-${idx}-${p.name}`,
          date: "", // no date
          type: "Pipeline",
          name: p.name,
          count: p.count,
          percentage: p.percentage,
          source: "pipeline",
        }));

        set({
          reports: [...sales, ...expenses, ...pipeline],
        });
      },

      selectReport: (id: string) => {
        const r = get().reports.find((rep) => rep.id === id) || null;
        set({ selectedReport: r });
      },

      // filterReports: returns reports filtered by current filters
      filterReports: () => {
        const { reports, filters } = get();

        const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
        // make dateTo inclusive by moving to end of day
        const to = filters.dateTo ? (() => {
          const d = new Date(filters.dateTo);
          d.setHours(23, 59, 59, 999);
          return d;
        })() : null;

        const mapped = (reports || []).filter((r: any) => {
          // reportType filtering - support case-insensitive matching and multiple UI strings
          const rt = String(filters.reportType || "").toLowerCase();

          if (rt && rt !== "all") {
            if (rt === "revenue" && r.type !== "Revenue") return false;
            if (rt === "expense" && r.type !== "Expense") return false;
            if (rt === "pipeline" && r.type !== "Pipeline") return false;
            if (rt === "forecast" && !(r.source === "forecast" || r.type === "Expense")) return false;
            if (rt === "sales" && r.type !== "Revenue") return false;
          }

          // agent filter: if specified, require matching agent property on report
          if (filters.agent && filters.agent.trim() !== "") {
            if (!r.agent || String(r.agent) !== String(filters.agent)) return false;
          }

          // region filter: if specified, require matching region property on report
          if (filters.region && filters.region.trim() !== "") {
            if (!r.region || String(r.region) !== String(filters.region)) return false;
          }

          // date range filter (only applies when report has a parsable date)
          if ((from || to) && r.date) {
            const d = new Date(r.date);
            if (isNaN(d.getTime())) return false;
            if (from && d < from) return false;
            if (to && d > to) return false;
          }

          return true;
        });

        // sort by date descending where possible, keep undated items at the end
        return mapped.sort((a: any, b: any) => {
          const ta = a.date && !isNaN(new Date(a.date).getTime()) ? new Date(a.date).getTime() : 0;
          const tb = b.date && !isNaN(new Date(b.date).getTime()) ? new Date(b.date).getTime() : 0;
          return tb - ta;
        });
      },

      calculateKPIs: () => {
        const { salesData, pipelineData, agentData, forecastData } = get();

        const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
        // prefer explicit 'Closed' stage if present, otherwise fallback to last stage or sum
        const closedStage = pipelineData.find((p) => String(p.name).toLowerCase().includes("closed"));
        const closedDeals = closedStage?.count
          ?? pipelineData[pipelineData.length - 1]?.count
          ?? pipelineData.reduce((s, p) => s + (p.count || 0), 0);

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
