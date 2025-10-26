import create from "zustand";
import { persist } from "zustand/middleware";
import { Expense, Category, ExpenseFilters } from "@/types/expenses";

interface UseExpenses {
  expenses: Expense[];
  categories: Category[];
  approvalsQueue: Expense[];
  filters: ExpenseFilters;
  selected: string[];
  loading: boolean;
  error?: string | null;

  loadDemoData: () => Promise<void>;
  createExpense: (payload: Expense) => void;
  updateExpense: (id: string, payload: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, decision: string, comment?: string) => void;
  markReimbursed: (id: string, paymentInfo: { method: string; reference: string; date: string; amount: number }) => void;
  bulkApprove: (ids: string[]) => void;
  bulkExport: (ids: string[]) => Expense[];
  filterExpenses: () => Expense[];
  getAnalytics: () => any;
}

export const useExpenses = create<UseExpenses>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: [],
      approvalsQueue: [],
      filters: { query: "", status: "", dateFrom: "", dateTo: "", category: "", project: "" },
      selected: [],
      loading: false,
      error: null,

      loadDemoData: async () => {
        try {
          const [expRes, catRes, apprRes] = await Promise.all([
            fetch("/data/demoExpenses.json"),
            fetch("/data/categories.json"),
            fetch("/data/approvals.json"),
          ]);
          const expenses = await expRes.json();
          const categories = await catRes.json();
          const approvalsList = await apprRes.json();

          // Map approvals queue to expense objects
          const approvalsQueue = approvalsList.map((a: any) => expenses.find((e: Expense) => e.id === a.expenseId)).filter(Boolean);

          set({ expenses, categories, approvalsQueue });
        } catch (e) {
          console.error(e);
          set({ error: "Failed to load demo data" });
        }
      },

      createExpense: (payload) => {
        set((state) => ({ expenses: [payload, ...state.expenses] }));
      },

      updateExpense: (id, payload) => {
        set((state) => ({ expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...payload, updatedAt: new Date().toISOString() } : e)) }));
      },

      deleteExpense: (id) => {
        // soft delete
        set((state) => ({ expenses: state.expenses.map((e) => (e.id === id ? { ...e, deleted: true, updatedAt: new Date().toISOString() } : e)) }));
      },

      approveExpense: (id, decision, comment) => {
        set((state) => ({
          expenses: state.expenses.map((e) => {
            if (e.id !== id) return e;
            const approvals = e.approvals || [];
            approvals.push({ by: "current-user", role: "Manager", decision, comment, date: new Date().toISOString() });
            const status = decision === "approve" ? (e.status === "Pending" ? "Manager Approved" : e.status) : decision === "reject" ? "Rejected" : e.status;
            return { ...e, approvals, status, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      markReimbursed: (id, paymentInfo) => {
        set((state) => ({
          expenses: state.expenses.map((e) => {
            if (e.id !== id) return e;
            const reimbursements = [...(e.reimbursements || []), paymentInfo];
            return { ...e, reimbursements, status: "Reimbursed", updatedAt: new Date().toISOString() };
          }),
        }));
      },

      bulkApprove: (ids) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (ids.includes(e.id) ? { ...e, status: "Manager Approved", updatedAt: new Date().toISOString() } : e)),
        }));
      },

      bulkExport: (ids) => {
        const ex = get().expenses.filter((e) => ids.includes(e.id));
        return ex;
      },

      filterExpenses: () => {
        const { expenses, filters } = get();
        let filtered = expenses.filter((e) => !e.deleted);
        if (filters.query) {
          const q = filters.query.toLowerCase();
          filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || (e.vendor || "").toLowerCase().includes(q));
        }
        if (filters.status) filtered = filtered.filter((e) => e.status === filters.status);
        if (filters.category) filtered = filtered.filter((e) => e.category === filters.category);
        if (filters.project) filtered = filtered.filter((e) => e.project === filters.project);
        if (filters.dateFrom) filtered = filtered.filter((e) => new Date(e.date) >= new Date(filters.dateFrom));
        if (filters.dateTo) filtered = filtered.filter((e) => new Date(e.date) <= new Date(filters.dateTo));
        return filtered;
      },

      getAnalytics: () => {
        const { expenses } = get();
        const byCategory: Record<string, number> = {};
        expenses.forEach((e) => {
          byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
        });
        const monthly: Record<string, number> = {};
        expenses.forEach((e) => {
          const d = new Date(e.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          monthly[key] = (monthly[key] || 0) + e.amount;
        });
        return { byCategory, monthly };
      },
    }),
    { name: "expenses-store" }
  )
);
