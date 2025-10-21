import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReportDetail {
  name: string;
  amount: number;
}

export interface Report {
  id: string;
  date: string;
  type: "Revenue" | "Expense";
  category: string;
  amount: number;
  createdBy: string;
  branch: string;
  paymentMethod: string;
  description?: string;
  details?: ReportDetail[];
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  reportType: "All" | "Revenue" | "Expense";
  department: string;
  branch: string;
  paymentMethod: string;
}

interface ReportsStore {
  reports: Report[];
  filters: ReportFilters;
  selectedReport: Report | null;

  setReports: (reports: Report[]) => void;
  setFilters: (filters: ReportFilters) => void;
  setSelectedReport: (report: Report | null) => void;

  fetchReports: () => Promise<void>;
  filterReports: () => Report[];
  exportReport: (type: "csv" | "json" | "pdf") => string;
  selectReport: (id: string) => void;
  getReportSummary: () => {
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
    outstandingBalance: number;
  };
}

export const useReports = create<ReportsStore>()(
  persist(
    (set, get) => ({
      reports: [],
      filters: {
        dateFrom: "",
        dateTo: "",
        reportType: "All",
        department: "",
        branch: "",
        paymentMethod: "",
      },
      selectedReport: null,

      setReports: (reports) => set({ reports }),
      setFilters: (filters) => set({ filters }),
      setSelectedReport: (report) => set({ selectedReport: report }),

      fetchReports: async () => {
        try {
          const response = await fetch("/data/mockReports.json");
          const reports = await response.json();
          set({ reports });
        } catch (error) {
          console.error("Failed to fetch reports:", error);
        }
      },

      filterReports: () => {
        const { reports, filters } = get();
        let filtered = reports;

        if (filters.reportType !== "All") {
          filtered = filtered.filter((r) => r.type === filters.reportType);
        }

        if (filters.dateFrom) {
          filtered = filtered.filter((r) => r.date >= filters.dateFrom);
        }

        if (filters.dateTo) {
          filtered = filtered.filter((r) => r.date <= filters.dateTo);
        }

        if (filters.branch) {
          filtered = filtered.filter((r) => r.branch === filters.branch);
        }

        if (filters.paymentMethod) {
          filtered = filtered.filter((r) => r.paymentMethod === filters.paymentMethod);
        }

        return filtered;
      },

      getReportSummary: () => {
        const filtered = get().filterReports();

        const totalRevenue = filtered
          .filter((r) => r.type === "Revenue")
          .reduce((sum, r) => sum + r.amount, 0);

        const totalExpense = filtered
          .filter((r) => r.type === "Expense")
          .reduce((sum, r) => sum + r.amount, 0);

        const netProfit = totalRevenue - totalExpense;
        const outstandingBalance = totalRevenue - totalExpense;

        return {
          totalRevenue,
          totalExpense,
          netProfit,
          outstandingBalance,
        };
      },

      exportReport: (type) => {
        const filtered = get().filterReports();

        if (type === "json") {
          return JSON.stringify(filtered, null, 2);
        }

        if (type === "csv") {
          const headers = [
            "Report ID",
            "Date",
            "Type",
            "Category",
            "Amount",
            "Created By",
            "Branch",
            "Payment Method",
          ];

          const rows = filtered.map((r) => [
            r.id,
            r.date,
            r.type,
            r.category,
            r.amount.toString(),
            r.createdBy,
            r.branch,
            r.paymentMethod,
          ]);

          return [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
          ].join("\n");
        }

        return "";
      },

      selectReport: (id) => {
        const { reports } = get();
        const report = reports.find((r) => r.id === id);
        set({ selectedReport: report || null });
      },
    }),
    {
      name: "reports-store",
    }
  )
);
