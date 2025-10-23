"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, TransactionFilters, TransactionStats, MonthlyTransactionData, Shareholder } from "@/types/transactions";

interface TransactionsStore {
  transactions: Transaction[];
  shareholders: Shareholder[];
  filters: TransactionFilters;
  selectedTransactionId?: string;

  // Setters
  setTransactions: (items: Transaction[]) => void;
  setShareholders: (items: Shareholder[]) => void;
  setFilters: (f: TransactionFilters) => void;
  setSelectedTransactionId: (id?: string) => void;

  // Actions
  loadDemoData: () => Promise<void>;
  createTransaction: (payload: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "auditLog">) => void;
  updateTransaction: (id: string, payload: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  approveTransaction: (id: string, approver: string) => void;
  rejectTransaction: (id: string, approver: string) => void;
  executeTransaction: (id: string) => void;

  // Selectors
  filterTransactions: () => Transaction[];
  getTransactionStats: () => TransactionStats;
  getMonthlyTransactionData: () => MonthlyTransactionData[];
  getTransactionsByType: () => Record<string, number>;
  searchTransactions: (query: string) => Transaction[];
}

export const useTransactions = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      shareholders: [],
      filters: { type: "All", status: "All" },
      selectedTransactionId: undefined,

      setTransactions: (items) => set({ transactions: items }),
      setShareholders: (items) => set({ shareholders: items }),
      setFilters: (f) => set({ filters: f }),
      setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),

      loadDemoData: async () => {
        try {
          const [txns, shareholders] = await Promise.all([
            fetch("/demo/demoTransactions.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/shareholders.json")
              .then((r) => r.json())
              .catch(() => []),
          ]);
          set({ transactions: txns, shareholders });
        } catch (e) {
          console.error("Failed to load demo data:", e);
        }
      },

      createTransaction: (payload) => {
        const id = `TXN-${Date.now()}`;
        const transaction: Transaction = {
          ...payload,
          id,
          auditLog: [
            {
              id: `AUD-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "Created",
              user: "System",
              details: `Transaction ${id} created`,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [...state.transactions, transaction] }));
      },

      updateTransaction: (id, payload) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...payload,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      approveTransaction: (id, approver) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "Approved" as const,
                  approvedBy: approver,
                  approvalDate: new Date().toISOString(),
                  auditLog: [
                    ...(t.auditLog || []),
                    {
                      id: `AUD-${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      action: "Approved" as const,
                      user: approver,
                      details: `Transaction approved by ${approver}`,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      rejectTransaction: (id, approver) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "Rejected" as const,
                  auditLog: [
                    ...(t.auditLog || []),
                    {
                      id: `AUD-${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      action: "Rejected" as const,
                      user: approver,
                      details: `Transaction rejected by ${approver}`,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      executeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "Executed" as const,
                  executedDate: new Date().toISOString(),
                  auditLog: [
                    ...(t.auditLog || []),
                    {
                      id: `AUD-${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      action: "Executed" as const,
                      user: "System",
                      details: `Transaction executed`,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      filterTransactions: () => {
        const { transactions, filters } = get();
        return transactions.filter((t) => {
          if (filters.type && filters.type !== "All" && t.type !== filters.type) return false;
          if (filters.status && filters.status !== "All" && t.status !== filters.status) return false;
          if (filters.entity && !t.entity.toLowerCase().includes(filters.entity.toLowerCase())) return false;
          if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) return false;
          if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo)) return false;
          return true;
        });
      },

      getTransactionStats: () => {
        const { transactions } = get();

        const stats: TransactionStats = {
          totalTransactions: transactions.length,
          totalSharesIssued: 0,
          totalExercisesCompleted: 0,
          pendingTransfers: 0,
          issuanceCount: 0,
          issuanceValue: 0,
          exerciseCount: 0,
          exerciseValue: 0,
          transferCount: 0,
          cancellationCount: 0,
        };

        transactions.forEach((t) => {
          if (t.type === "Issuance") {
            stats.issuanceCount++;
            stats.issuanceValue += t.totalAmount;
            stats.totalSharesIssued += t.quantity;
          } else if (t.type === "Exercise") {
            stats.exerciseCount++;
            stats.exerciseValue += t.totalAmount;
            stats.totalExercisesCompleted += t.quantity;
          } else if (t.type === "Transfer") {
            stats.transferCount++;
            if (t.status === "Pending") stats.pendingTransfers++;
          } else if (t.type === "Cancellation") {
            stats.cancellationCount++;
          }
        });

        return stats;
      },

      getMonthlyTransactionData: () => {
        const { transactions } = get();
        const monthlyMap = new Map<string, MonthlyTransactionData>();

        transactions.forEach((t) => {
          const monthKey = t.date.substring(0, 7); // YYYY-MM

          if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, {
              month: monthKey,
              issuances: 0,
              exercises: 0,
              transfers: 0,
              cancellations: 0,
              totalShares: 0,
            });
          }

          const data = monthlyMap.get(monthKey)!;
          if (t.type === "Issuance") data.issuances += t.quantity;
          else if (t.type === "Exercise") data.exercises += t.quantity;
          else if (t.type === "Transfer") data.transfers += t.quantity;
          else if (t.type === "Cancellation") data.cancellations += t.quantity;
          data.totalShares += t.quantity;
        });

        return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
      },

      getTransactionsByType: () => {
        const { transactions } = get();
        const counts: Record<string, number> = {
          Issuance: 0,
          Exercise: 0,
          Transfer: 0,
          Cancellation: 0,
          Conversion: 0,
        };

        transactions.forEach((t) => {
          counts[t.type]++;
        });

        return counts;
      },

      searchTransactions: (query: string) => {
        const { transactions } = get();
        const lowerQuery = query.toLowerCase();
        return transactions.filter(
          (t) =>
            t.id.toLowerCase().includes(lowerQuery) ||
            t.entity.toLowerCase().includes(lowerQuery) ||
            t.notes?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    { name: "transactions-store" }
  )
);
