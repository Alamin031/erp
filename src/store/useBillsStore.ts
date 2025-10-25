import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Bill, BillStatus } from "@/types/bills";

export interface BillsFilters {
  vendor: string;
  status: BillStatus | "";
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface BillsStore {
  bills: Bill[];
  loading: boolean;
  filters: BillsFilters;

  loadDemoData: () => Promise<void>;
  addBill: (bill: Omit<Bill, "id" | "createdAt" | "updatedAt" | "balance" | "paidAmount">) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markAsPaid: (id: string, options?: { paymentMode?: string; reference?: string; paidDate?: string }) => void;
  setFilters: (f: Partial<BillsFilters>) => void;
  resetFilters: () => void;

  filterBills: () => Bill[];
  getVendors: () => string[];
}

export const useBillsStore = create<BillsStore>()(
  persist(
    (set, get) => ({
      bills: [],
      loading: false,
      filters: { vendor: "", status: "", dateFrom: "", dateTo: "", search: "" },

      loadDemoData: async () => {
        if (get().loading) return;
        set({ loading: true });
        try {
          const res = await fetch("/data/ap.json");
          const data = (await res.json()) as any[];
          const bills: Bill[] = data.map((b) => ({
            ...b,
            attachment: null,
            paymentMode: undefined,
            paidDate: b.status === "Paid" ? b.updatedAt || b.dueDate : null,
            paymentReference: null,
            lineItems: [
              {
                id: `${b.id}-li-1`,
                itemName: "Services",
                quantity: 1,
                unitPrice: Number(b.amount) || 0,
                taxRate: 0,
              },
            ],
          }));
          set({ bills });
        } catch (e) {
          console.error("Failed to load bills demo data", e);
        } finally {
          set({ loading: false });
        }
      },

      addBill: (bill) => {
        const id = `bill-${Date.now()}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const paidAmount = bill.status === "Paid" ? bill.amount : 0;
        const balance = Math.max(0, bill.amount - paidAmount);
        const newBill: Bill = {
          ...bill,
          id,
          billNumber: bill.billNumber || id.toUpperCase(),
          createdAt,
          updatedAt,
          paidAmount,
          balance,
        } as Bill;
        set((state) => ({ bills: [newBill, ...state.bills] }));
      },

      updateBill: (id, updates) => {
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  balance:
                    updates.amount !== undefined || updates.paidAmount !== undefined
                      ? Math.max(0, (updates.amount ?? b.amount) - (updates.paidAmount ?? b.paidAmount))
                      : b.balance,
                }
              : b
          ),
        }));
      },

      deleteBill: (id) => {
        set((state) => ({ bills: state.bills.filter((b) => b.id !== id) }));
      },

      markAsPaid: (id, options) => {
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "Paid",
                  paidAmount: b.amount,
                  balance: 0,
                  paidDate: options?.paidDate || new Date().toISOString(),
                  paymentMode: (options?.paymentMode as any) || b.paymentMode,
                  paymentReference: options?.reference ?? b.paymentReference,
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));
      },

      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: { vendor: "", status: "", dateFrom: "", dateTo: "", search: "" } }),

      filterBills: () => {
        const { bills, filters } = get();
        const { vendor, status, dateFrom, dateTo, search } = filters;
        return bills.filter((b) => {
          if (vendor && b.vendorName !== vendor) return false;
          if (status && b.status !== status) return false;
          if (dateFrom && new Date(b.billDate) < new Date(dateFrom)) return false;
          if (dateTo && new Date(b.billDate) > new Date(dateTo)) return false;
          if (search) {
            const s = search.toLowerCase();
            if (
              !(
                b.billNumber.toLowerCase().includes(s) ||
                b.vendorName.toLowerCase().includes(s) ||
                b.notes?.toLowerCase().includes(s)
              )
            )
              return false;
          }
          return true;
        });
      },

      getVendors: () => {
        const names = Array.from(new Set(get().bills.map((b) => b.vendorName)));
        names.sort((a, b) => a.localeCompare(b));
        return names;
      },
    }),
    { name: "bills-store" }
  )
);
