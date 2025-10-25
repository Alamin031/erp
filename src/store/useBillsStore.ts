import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Bill, BillFilters, BillStatus, BillStats } from "@/types/bills";

interface BillsStore {
  bills: Bill[];
  filters: BillFilters;
  selectedBill: Bill | null;

  setBills: (bills: Bill[]) => void;
  setFilters: (filters: BillFilters) => void;
  setSelectedBill: (bill: Bill | null) => void;

  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markAsPaid: (id: string, paymentMode: PaymentMode, referenceNumber: string) => void;

  filterBills: () => Bill[];
  getBillStats: () => BillStats;
  getVendorStats: () => Array<{ name: string; amount: number; billCount: number }>;
  getMonthlyTrend: () => Array<{ month: string; bills: number; amount: number }>;
}

type PaymentMode = "Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Online";

export const useBillsStore = create<BillsStore>()(
  persist(
    (set, get) => ({
      bills: [],
      filters: {
        vendor: "",
        status: "",
        dateFrom: "",
        dateTo: "",
        searchQuery: "",
      },
      selectedBill: null,

      setBills: (bills) => set({ bills }),

      setFilters: (filters) => set({ filters }),

      setSelectedBill: (bill) => set({ selectedBill: bill }),

      addBill: (bill) => {
        set((state) => ({
          bills: [...state.bills, bill],
        }));
      },

      updateBill: (id, updates) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id
              ? {
                  ...bill,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : bill
          ),
        }));
      },

      deleteBill: (id) => {
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        }));
      },

      markAsPaid: (id, paymentMode, referenceNumber) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id
              ? {
                  ...bill,
                  status: "Paid" as BillStatus,
                  paymentMode,
                  referenceNumber,
                  paymentDate: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : bill
          ),
        }));
      },

      filterBills: () => {
        const { bills, filters } = get();
        let filtered = bills;

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (bill) =>
              bill.billNumber.toLowerCase().includes(query) ||
              bill.vendorName.toLowerCase().includes(query)
          );
        }

        if (filters.vendor) {
          filtered = filtered.filter((bill) => bill.vendorName === filters.vendor);
        }

        if (filters.status) {
          filtered = filtered.filter((bill) => bill.status === filters.status);
        }

        if (filters.dateFrom) {
          filtered = filtered.filter(
            (bill) => new Date(bill.billDate) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(
            (bill) => new Date(bill.billDate) <= new Date(filters.dateTo)
          );
        }

        return filtered;
      },

      getBillStats: () => {
        const { bills } = get();
        const now = new Date();

        const stats = {
          totalBills: bills.length,
          totalPaid: bills.filter((b) => b.status === "Paid").length,
          totalPending: bills.filter((b) => b.status === "Pending").length,
          overdueBills: bills.filter(
            (b) => b.status !== "Paid" && new Date(b.dueDate) < now
          ).length,
          totalAmount: bills.reduce((sum, b) => sum + b.amount, 0),
          pendingAmount: bills
            .filter((b) => b.status !== "Paid")
            .reduce((sum, b) => sum + b.amount, 0),
        };

        return stats;
      },

      getVendorStats: () => {
        const { bills } = get();
        const vendorMap: Record<string, { amount: number; count: number }> = {};

        bills.forEach((bill) => {
          if (!vendorMap[bill.vendorName]) {
            vendorMap[bill.vendorName] = { amount: 0, count: 0 };
          }
          vendorMap[bill.vendorName].amount += bill.amount;
          vendorMap[bill.vendorName].count += 1;
        });

        return Object.entries(vendorMap).map(([name, data]) => ({
          name,
          amount: data.amount,
          billCount: data.count,
        }));
      },

      getMonthlyTrend: () => {
        const { bills } = get();
        const trendMap: Record<string, { bills: number; amount: number }> = {};

        bills.forEach((bill) => {
          const date = new Date(bill.billDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

          if (!trendMap[key]) {
            trendMap[key] = { bills: 0, amount: 0 };
          }
          trendMap[key].bills += 1;
          trendMap[key].amount += bill.amount;
        });

        return Object.entries(trendMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, data]) => ({
            month,
            ...data,
          }));
      },
    }),
    {
      name: "bills-store",
    }
  )
);
