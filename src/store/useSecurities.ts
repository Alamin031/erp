"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Security, StockOption, EquityAward, Valuation, SecuritiesFilter, CapTableData } from "@/types/securities";

interface SecuritiesStore {
  securities: Security[];
  stockOptions: StockOption[];
  equityAwards: EquityAward[];
  valuations: Valuation[];
  filters: SecuritiesFilter;
  selectedSecurityId?: string;

  // Setters
  setSecurities: (items: Security[]) => void;
  setStockOptions: (items: StockOption[]) => void;
  setEquityAwards: (items: EquityAward[]) => void;
  setValuations: (items: Valuation[]) => void;
  setFilters: (f: SecuritiesFilter) => void;
  setSelectedSecurityId: (id?: string) => void;

  // Actions
  loadDemoData: () => Promise<void>;
  addSecurity: (payload: Omit<Security, "id" | "createdAt" | "updatedAt">) => void;
  updateSecurity: (id: string, payload: Partial<Security>) => void;
  deleteSecurity: (id: string) => void;
  addStockOption: (payload: Omit<StockOption, "id" | "createdAt" | "updatedAt">) => void;
  updateStockOption: (id: string, payload: Partial<StockOption>) => void;
  deleteStockOption: (id: string) => void;
  addEquityAward: (payload: Omit<EquityAward, "id" | "createdAt" | "updatedAt">) => void;
  updateEquityAward: (id: string, payload: Partial<EquityAward>) => void;
  deleteEquityAward: (id: string) => void;

  // Selectors
  filterSecurities: () => Security[];
  getCapTableData: () => CapTableData;
  getTotalSharesIssued: () => number;
  getTotalStockOptionsGranted: () => number;
  getActiveEquityAwards: () => number;
  getCurrentValuation: () => number;
}

export const useSecurities = create<SecuritiesStore>()(
  persist(
    (set, get) => ({
      securities: [],
      stockOptions: [],
      equityAwards: [],
      valuations: [],
      filters: { type: "All", status: "All" },
      selectedSecurityId: undefined,

      setSecurities: (items) => set({ securities: items }),
      setStockOptions: (items) => set({ stockOptions: items }),
      setEquityAwards: (items) => set({ equityAwards: items }),
      setValuations: (items) => set({ valuations: items }),
      setFilters: (f) => set({ filters: f }),
      setSelectedSecurityId: (id) => set({ selectedSecurityId: id }),

      loadDemoData: async () => {
        try {
          const [sec, opt, awd, val] = await Promise.all([
            fetch("/demo/demoSecurities.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoStockOptions.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoEquityAwards.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoValuations.json")
              .then((r) => r.json())
              .catch(() => []),
          ]);
          set({ securities: sec, stockOptions: opt, equityAwards: awd, valuations: val });
        } catch (e) {
          console.error("Failed to load demo data:", e);
        }
      },

      addSecurity: (payload) => {
        const id = `SEC-${Date.now()}`;
        const security: Security = {
          ...payload,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ securities: [...state.securities, security] }));
      },

      updateSecurity: (id, payload) => {
        set((state) => ({
          securities: state.securities.map((s) =>
            s.id === id ? { ...s, ...payload, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      deleteSecurity: (id) => {
        set((state) => ({
          securities: state.securities.filter((s) => s.id !== id),
        }));
      },

      addStockOption: (payload) => {
        const id = `OPT-${Date.now()}`;
        const option: StockOption = {
          ...payload,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ stockOptions: [...state.stockOptions, option] }));
      },

      updateStockOption: (id, payload) => {
        set((state) => ({
          stockOptions: state.stockOptions.map((o) =>
            o.id === id ? { ...o, ...payload, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      deleteStockOption: (id) => {
        set((state) => ({
          stockOptions: state.stockOptions.filter((o) => o.id !== id),
        }));
      },

      addEquityAward: (payload) => {
        const id = `AWD-${Date.now()}`;
        const award: EquityAward = {
          ...payload,
          id,
          history: [
            {
              id: `H-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "Created",
              user: "System",
              details: "Award created",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ equityAwards: [...state.equityAwards, award] }));
      },

      updateEquityAward: (id, payload) => {
        set((state) => ({
          equityAwards: state.equityAwards.map((a) =>
            a.id === id ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      deleteEquityAward: (id) => {
        set((state) => ({
          equityAwards: state.equityAwards.filter((a) => a.id !== id),
        }));
      },

      filterSecurities: () => {
        const { securities, filters } = get();
        return securities.filter((s) => {
          if (filters.holderName && !s.holderName.toLowerCase().includes(filters.holderName.toLowerCase())) return false;
          if (filters.type && filters.type !== "All" && s.type !== filters.type) return false;
          if (filters.status && filters.status !== "All" && s.status !== filters.status) return false;
          if (filters.dateFrom && new Date(s.issueDate) < new Date(filters.dateFrom)) return false;
          if (filters.dateTo && new Date(s.issueDate) > new Date(filters.dateTo)) return false;
          if (filters.minShares && s.shares < filters.minShares) return false;
          return true;
        });
      },

      getCapTableData: () => {
        const { securities } = get();
        const totalShares = securities.reduce((sum, s) => sum + s.shares, 0);
        const totalValuation = securities.reduce((sum, s) => sum + s.shares * s.value, 0);

        // Group by category (simplified)
        const founderShares = securities
          .filter((s) => s.type === "Common" && s.holderName.includes("Founder"))
          .reduce((sum, s) => sum + s.shares, 0);
        const investorShares = securities
          .filter((s) => s.type === "Preferred")
          .reduce((sum, s) => sum + s.shares, 0);
        const employeeShares = securities
          .filter((s) => s.type === "Common" && !s.holderName.includes("Founder"))
          .reduce((sum, s) => sum + s.shares, 0);

        const ownership = [];
        if (founderShares > 0) {
          ownership.push({
            category: "Founders",
            shares: founderShares,
            percentage: totalShares > 0 ? (founderShares / totalShares) * 100 : 0,
            valuation: founderShares * (totalValuation / totalShares || 0),
          });
        }
        if (investorShares > 0) {
          ownership.push({
            category: "Investors",
            shares: investorShares,
            percentage: totalShares > 0 ? (investorShares / totalShares) * 100 : 0,
            valuation: investorShares * (totalValuation / totalShares || 0),
          });
        }
        if (employeeShares > 0) {
          ownership.push({
            category: "Employees",
            shares: employeeShares,
            percentage: totalShares > 0 ? (employeeShares / totalShares) * 100 : 0,
            valuation: employeeShares * (totalValuation / totalShares || 0),
          });
        }

        return { totalShares, totalValuation, ownership };
      },

      getTotalSharesIssued: () => {
        const { securities } = get();
        return securities.reduce((sum, s) => sum + s.shares, 0);
      },

      getTotalStockOptionsGranted: () => {
        const { stockOptions } = get();
        return stockOptions.reduce((sum, o) => sum + o.quantity, 0);
      },

      getActiveEquityAwards: () => {
        const { equityAwards } = get();
        return equityAwards.filter((a) => a.status === "Active" || a.status === "Pending").length;
      },

      getCurrentValuation: () => {
        const { valuations } = get();
        if (valuations.length === 0) return 0;
        const latest = valuations.reduce((prev, current) => {
          return new Date(current.date) > new Date(prev.date) ? current : prev;
        });
        return latest.companyValuation;
      },
    }),
    { name: "securities-store" }
  )
);
