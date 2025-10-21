import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Invoice, InvoiceFilters } from "@/types/invoice";

interface InvoicesStore {
  invoices: Invoice[];
  filters: InvoiceFilters;
  selectedInvoice: Invoice | null;
  setInvoices: (invoices: Invoice[]) => void;
  setFilters: (filters: InvoiceFilters) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  createInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markPaid: (id: string, paymentMethod?: string, transactionId?: string) => void;
  filterInvoices: () => Invoice[];
  getInvoiceStats: () => {
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    overdueInvoices: number;
    totalRevenue: number;
    pendingRevenue: number;
    monthlyRevenue: number;
    averageInvoiceValue: number;
  };
  getPaymentMethodBreakdown: () => Record<string, number>;
  exportInvoices: (format: "csv" | "json") => string;
}

export const useInvoices = create<InvoicesStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      filters: {
        status: "",
        clientType: "",
        searchQuery: "",
        dateFrom: "",
        dateTo: "",
      },
      selectedInvoice: null,

      setInvoices: (invoices) => set({ invoices }),

      setFilters: (filters) => set({ filters }),

      setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),

      createInvoice: (invoice) => {
        set(state => ({
          invoices: [...state.invoices, invoice],
        }));
      },

      updateInvoice: (id, updates) => {
        set(state => ({
          invoices: state.invoices.map(inv =>
            inv.id === id
              ? {
                  ...inv,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : inv
          ),
        }));
      },

      deleteInvoice: (id) => {
        set(state => ({
          invoices: state.invoices.filter(inv => inv.id !== id),
        }));
      },

      markPaid: (id, paymentMethod, transactionId) => {
        set(state => ({
          invoices: state.invoices.map(inv =>
            inv.id === id
              ? {
                  ...inv,
                  status: "Paid" as const,
                  paymentMethod: paymentMethod as any,
                  transactionId,
                  paidDate: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : inv
          ),
        }));
      },

      filterInvoices: () => {
        const { invoices, filters } = get();
        let filtered = invoices;

        if (filters.status) {
          filtered = filtered.filter(inv => inv.status === filters.status);
        }

        if (filters.clientType) {
          filtered = filtered.filter(inv => inv.clientType === filters.clientType);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            inv =>
              inv.invoiceNumber.toLowerCase().includes(query) ||
              inv.clientName.toLowerCase().includes(query) ||
              inv.clientCompany?.toLowerCase().includes(query)
          );
        }

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom).getTime();
          filtered = filtered.filter(
            inv => new Date(inv.issueDate).getTime() >= fromDate
          );
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo).getTime();
          filtered = filtered.filter(
            inv => new Date(inv.issueDate).getTime() <= toDate
          );
        }

        return filtered;
      },

      getInvoiceStats: () => {
        const invoices = get().invoices;
        const now = new Date();
        
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === "Paid").length;
        const unpaidInvoices = invoices.filter(inv => inv.status === "Pending").length;
        const overdueInvoices = invoices.filter(
          inv =>
            inv.status !== "Paid" && new Date(inv.dueDate) < now
        ).length;
        
        const totalRevenue = invoices
          .filter(inv => inv.status === "Paid")
          .reduce((sum, inv) => sum + inv.totalAmount, 0);
        
        const pendingRevenue = invoices
          .filter(inv => inv.status !== "Paid")
          .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyRevenue = invoices
          .filter(
            inv =>
              new Date(inv.issueDate).getMonth() === currentMonth &&
              new Date(inv.issueDate).getFullYear() === currentYear &&
              inv.status === "Paid"
          )
          .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const averageInvoiceValue =
          totalInvoices > 0
            ? invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / totalInvoices
            : 0;

        return {
          totalInvoices,
          paidInvoices,
          unpaidInvoices,
          overdueInvoices,
          totalRevenue,
          pendingRevenue,
          monthlyRevenue,
          averageInvoiceValue,
        };
      },

      getPaymentMethodBreakdown: () => {
        const invoices = get().invoices.filter(inv => inv.status === "Paid");
        const breakdown: Record<string, number> = {
          Cash: 0,
          Card: 0,
          "Bank Transfer": 0,
          Pending: 0,
        };

        invoices.forEach(inv => {
          if (inv.paymentMethod && breakdown.hasOwnProperty(inv.paymentMethod)) {
            breakdown[inv.paymentMethod] += inv.totalAmount;
          }
        });

        const unpaidTotal = get()
          .invoices.filter(inv => inv.status !== "Paid")
          .reduce((sum, inv) => sum + inv.totalAmount, 0);

        breakdown["Pending"] = unpaidTotal;

        return breakdown;
      },

      exportInvoices: (format) => {
        const invoices = get().filterInvoices();

        if (format === "json") {
          return JSON.stringify(invoices, null, 2);
        }

        if (format === "csv") {
          const headers = [
            "Invoice Number",
            "Client Name",
            "Amount",
            "Status",
            "Issue Date",
            "Due Date",
            "Payment Method",
          ];

          const rows = invoices.map(inv => [
            inv.invoiceNumber,
            inv.clientName,
            inv.totalAmount.toFixed(2),
            inv.status,
            new Date(inv.issueDate).toLocaleDateString(),
            new Date(inv.dueDate).toLocaleDateString(),
            inv.paymentMethod || "N/A",
          ]);

          const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
          ].join("\n");

          return csvContent;
        }

        return "";
      },
    }),
    {
      name: "invoices-store",
    }
  )
);
